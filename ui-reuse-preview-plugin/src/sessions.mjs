import { randomUUID, randomBytes } from 'node:crypto';
import path from 'node:path';
import { workspaceRoot, scanWorkspace, verifyProjectPath } from './workspace.mjs';
import { renderPreview, renderExport, sanitizeDesign } from './render.mjs';
import { parseHTML } from 'linkedom';

const maxInputBytes = 8 * 1024 * 1024;
const allowedMime = new Set(['text/html', 'image/png', 'image/jpeg', 'image/webp']);

export class Sessions {
  constructor() { this.items = new Map(); }

  create() {
    if (this.items.size >= 24) throw new Error('已打开过多面板，请重启插件释放旧会话。');
    const session = { id: randomUUID(), root: null, workspaceName: '', revision: 0, status: 'binding', source: null, annotations: [], previewHtml: '', exportHtml: '', message: '等待当前 agent 关联工作区。' };
    this.items.set(session.id, session);
    return session;
  }

  get(id) {
    const session = this.items.get(id);
    if (!session) throw new Error('面板会话已失效，请重新打开插件。');
    return session;
  }

  async bind(id, root) {
    const session = this.get(id);
    const normalized = await workspaceRoot(root);
    if (session.root && session.root !== normalized) throw new Error('面板已关联其他工作区，请打开新面板。');
    session.root = normalized;
    session.workspaceName = path.basename(normalized);
    session.status = 'idle';
    session.message = '已关联当前工作区。请选择 HTML 或设计图片。';
    return this.snapshot(id);
  }

  setSource(id, source) {
    const session = this.get(id);
    if (!session.root) throw new Error('工作区尚未关联。');
    if (!allowedMime.has(source.mimeType)) throw new Error('支持 HTML、PNG、JPEG 和 WebP。');
    const buffer = source.mimeType === 'text/html' ? Buffer.from(source.content, 'utf8') : Buffer.from(source.content, 'base64');
    if (!buffer.length || buffer.length > maxInputBytes) throw new Error('请选择非空且不超过 8 MiB 的文件。');
    if (source.mimeType === 'image/png' && !buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('PNG 内容无效。');
    if (source.mimeType === 'image/jpeg' && (buffer[0] !== 255 || buffer[1] !== 216)) throw new Error('JPEG 内容无效。');
    if (source.mimeType === 'image/webp' && !(buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP')) throw new Error('WebP 内容无效。');
    session.revision += 1;
    session.source = { name: source.name.slice(0, 180), mimeType: source.mimeType, content: source.content };
    session.annotations = [];
    session.previewHtml = '';
    session.exportHtml = '';
    session.status = 'idle';
    session.message = '文件已读取，准备自动生成标注。';
    return this.snapshot(id);
  }

  reset(id) {
    const session = this.get(id);
    session.revision += 1;
    session.source = null;
    session.annotations = [];
    session.previewHtml = '';
    session.exportHtml = '';
    session.status = session.root ? 'idle' : 'binding';
    session.message = session.root ? '请选择 HTML 或设计图片。' : '等待当前 agent 关联工作区。';
    return this.snapshot(id);
  }

  begin(id) {
    const session = this.get(id);
    if (!session.root || !session.source) throw new Error('请先关联工作区并选择文件。');
    if (session.status === 'processing') throw new Error('当前文件正在生成。');
    session.revision += 1;
    session.status = 'processing';
    session.message = '当前 agent 正在读取设计并查找 UI 复用组件。';
    return this.snapshot(id);
  }

  fail(id, revision, message) {
    const session = this.get(id);
    if (revision !== session.revision) throw new Error('生成版本已过期。');
    session.status = 'error';
    session.message = message.slice(0, 1000);
    return this.snapshot(id);
  }

  snapshot(id, withHtml = false) {
    const session = this.get(id);
    return {
      sessionId: id,
      workspaceName: session.workspaceName,
      revision: session.revision,
      status: session.status,
      source: session.source ? { name: session.source.name, mimeType: session.source.mimeType } : null,
      annotations: session.annotations,
      message: session.message,
      ...(withHtml ? { previewHtml: session.previewHtml, exportHtml: session.exportHtml } : {})
    };
  }

  async publish(id, revision, html, annotations) {
    const session = this.get(id);
    if (revision !== session.revision || session.status !== 'processing') throw new Error('生成版本已过期，请为当前文件重新生成。');
    if (Buffer.byteLength(html) > maxInputBytes) throw new Error('生成的 HTML 超过 8 MiB。');
    const scan = await scanWorkspace(session.root);
    const ids = new Set();
    const { document } = parseHTML(sanitizeDesign(html));
    const verified = [];
    for (const annotation of annotations) {
      if (!/^R[0-9]{2,4}$/.test(annotation.id) || ids.has(annotation.id)) throw new Error('标注编号必须唯一，例如 R01。');
      ids.add(annotation.id);
      let targets;
      try { targets = document.querySelectorAll(annotation.selector); }
      catch { throw new Error(`${annotation.id} 的选择器语法无效。`); }
      if (targets.length !== 1) throw new Error(`${annotation.id} 必须精确定位一个 HTML 元素，实际为 ${targets.length} 个。`);
      const item = { ...annotation };
      item.recommendation = item.recommendation || (item.kind === 'unresolved' ? 'new' : 'reuse');
      if (!['reuse', 'adapt', 'new'].includes(item.recommendation)) throw new Error('复用建议类型无效。');
      if (item.kind === 'unresolved' && item.recommendation !== 'new') throw new Error('未匹配区域应标为建议新建共享封装。');
      if (item.kind === 'project' && !item.sourcePath) throw new Error('项目组件必须提供真实定义路径。');
      if (item.kind === 'library' && (!item.packageName || !scan.packageVersions[item.packageName])) throw new Error('组件库必须在工作区包清单中存在。');
      for (const key of ['sourcePath', 'evidencePath', 'themePath']) if (item[key]) item[key] = await verifyProjectPath(session.root, item[key]);
      verified.push(item);
    }
    if (revision !== session.revision || session.status !== 'processing') throw new Error('生成期间状态已更换，结果未发布。');
    const nonce = randomBytes(16).toString('hex');
    session.annotations = verified;
    session.previewHtml = renderPreview(html, verified, nonce);
    session.exportHtml = renderExport(session.previewHtml, verified, session.workspaceName, session.source.name, nonce);
    session.status = 'ready';
    session.message = `已生成 ${verified.length} 个 UI 标注；路径已验证，候选匹配仅限 UI。`;
    return this.snapshot(id);
  }
}
