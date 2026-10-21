import { readdir, readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';

const excluded = new Set(['node_modules', '.git', '.agents', '.codex', 'dist', 'build', 'coverage', '.next', '.nuxt', 'vendor']);
const codeExtensions = new Set(['.vue', '.tsx', '.jsx', '.ts', '.js', '.mjs', '.cjs', '.css', '.less', '.scss', '.sass', '.html']);
const libraryNames = ['element-plus', 'ant-design-vue', 'naive-ui', '@arco-design/web-vue', 'vant', 'vuetify', 'primevue', 'tdesign-vue-next', 'view-ui-plus'];
const maxFiles = 3000;
const maxBytes = 24 * 1024 * 1024;

export function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

export async function workspaceRoot(value) {
  if (!path.isAbsolute(value)) throw new Error('工作区必须是当前会话提供的绝对路径。');
  const root = await realpath(value);
  if (!(await stat(root)).isDirectory()) throw new Error('工作区目录不存在。');
  return root;
}

function allowedFile(name) {
  if (/secret|credential|\.env|\.npmrc|private[-_]key/i.test(name)) return false;
  return codeExtensions.has(path.extname(name)) || /^(package|components|tsconfig(?:\.[\w-]+)?)\.json$/.test(path.basename(name));
}

export async function readWorkspaceFile(root, relativePath) {
  const requested = path.resolve(root, relativePath);
  if (!isWithin(root, requested)) throw new Error('文件超出当前工作区。');
  const resolved = await realpath(requested);
  if (!isWithin(root, resolved) || !allowedFile(resolved)) throw new Error('该文件不属于可读取的 UI 源码范围。');
  if (path.relative(root, resolved).split(path.sep).some(part => excluded.has(part))) throw new Error('该目录不参与 UI 分析。');
  const info = await stat(resolved);
  if (info.size > 256 * 1024) throw new Error('源码文件超过 256 KiB，请由当前 agent 定向读取。');
  return readFile(resolved, 'utf8');
}

export async function verifyProjectPath(root, value) {
  if (!value || path.isAbsolute(value)) throw new Error('标注路径必须是工作区内真实存在的相对路径。');
  await readWorkspaceFile(root, value);
  return value.replaceAll('\\', '/');
}

export async function scanWorkspace(root) {
  const files = [];
  let visited = 0;
  let bytes = 0;
  let truncated = false;
  const warnings = [];
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (visited >= maxFiles || bytes >= maxBytes) { truncated = true; return; }
      if (entry.isSymbolicLink() || excluded.has(entry.name) || entry.name.startsWith('.')) continue;
      const location = path.join(directory, entry.name);
      if (entry.isDirectory()) { await walk(location); continue; }
      if (!entry.isFile() || !allowedFile(location)) continue;
      visited += 1;
      try {
        const info = await stat(location);
        if (info.size > 256 * 1024) { warnings.push(`跳过大文件：${path.relative(root, location)}`); continue; }
        bytes += info.size;
        if (bytes > maxBytes) { truncated = true; return; }
        files.push({ path: path.relative(root, location).replaceAll('\\', '/'), text: await readWorkspaceFile(root, path.relative(root, location)) });
      } catch (error) { warnings.push(`${path.relative(root, location)}：${error.message}`); }
    }
  }
  await walk(root);
  const manifests = files.filter(file => path.basename(file.path) === 'package.json').map(file => {
    try { return { path: file.path, json: JSON.parse(file.text) }; }
    catch { warnings.push(`无法解析 ${file.path}`); return null; }
  }).filter(Boolean);
  const packageVersions = Object.assign({}, ...manifests.map(file => ({ ...file.json.dependencies, ...file.json.devDependencies })));
  const libraries = libraryNames.filter(name => packageVersions[name]).map(name => {
    const references = files.filter(file => file.path.endsWith('.json') === false && file.text.includes(name));
    const themeEvidence = references.filter(file => new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^'"\\n]*(?:theme|style|css|scss|less)|(?:theme|style|css|scss|less)[^'"\\n]*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(file.text));
    return { name, version: packageVersions[name], importReferenceFiles: references.map(file => file.path), themeEvidence: themeEvidence.map(file => file.path), note: '引用计数为线索；agent 仍需检查全局注册、自动导入、标签使用和主题入口是否生效。' };
  });
  const components = files.filter(file => /(?:^|\/)(?:components|ui|widgets)\//i.test(file.path) && /\.(vue|tsx|jsx)$/.test(file.path)).map(file => ({
    path: file.path,
    name: path.basename(file.path).replace(/\.(vue|tsx|jsx)$/, '') === 'index' ? path.basename(path.dirname(file.path)) : path.basename(file.path).replace(/\.(vue|tsx|jsx)$/, '')
  }));
  return {
    workspaceName: path.basename(root),
    filesScanned: files.length,
    truncated,
    warnings: warnings.slice(0, 40),
    libraries,
    packageVersions,
    components,
    themeFiles: files.filter(file => /theme|tokens|variables|overrides/i.test(file.path) && /\.(css|less|scss|sass|ts|js)$/.test(file.path)).map(file => file.path),
    configurationFiles: files.filter(file => /(?:vite|webpack|nuxt)\.config|components\.d\.ts|main\.[jt]s$/.test(file.path)).map(file => file.path),
    manifestPaths: manifests.map(file => file.path)
  };
}
