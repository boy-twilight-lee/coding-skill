import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { Sessions } from '../src/sessions.mjs';
import { scanWorkspace, readWorkspaceFile } from '../src/workspace.mjs';
import { sanitizeDesign } from '../src/render.mjs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'ui-reuse-test-'));
  const root = path.join(directory, 'project');
  await mkdir(path.join(root, 'src/components/app-button'), { recursive: true });
  await mkdir(path.join(root, 'src/styles'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ dependencies: { 'element-plus': '2.8.8' } }));
  await writeFile(path.join(root, 'src/components/app-button/index.vue'), '<template><el-button><slot /></el-button></template>');
  await writeFile(path.join(root, 'src/styles/theme.css'), ':root { --el-color-primary: #6554c0; }');
  await writeFile(path.join(root, 'src/main.js'), "import 'element-plus/theme-chalk/index.css'; import './styles/theme.css';");
  t.after(() => rm(directory, { recursive: true, force: true }));
  return { root, directory };
}

const source = { name: 'design.html', mimeType: 'text/html', content: '<!doctype html><html><body><button id="save">保存</button></body></html>' };
const mapping = { id: 'R01', selector: '#save', label: '保存按钮', component: 'app-button', kind: 'project', sourcePath: 'src/components/app-button/index.vue', themePath: 'src/styles/theme.css', adaptation: '使用主题颜色' };

test('workspace inventory identifies shared components and active-theme evidence', async t => {
  const { root } = await fixture(t);
  const result = await scanWorkspace(root);
  assert.equal(result.components[0].name, 'app-button');
  assert.equal(result.libraries[0].version, '2.8.8');
  assert.ok(result.libraries[0].themeEvidence.includes('src/main.js'));
  assert.equal(result.truncated, false);
});

test('file reads reject traversal, secret files and symlink escapes', async t => {
  const { root, directory } = await fixture(t);
  await writeFile(path.join(directory, 'outside.js'), 'outside');
  await writeFile(path.join(root, '.env'), 'secret');
  await assert.rejects(readWorkspaceFile(root, '../outside.js'), /超出/);
  await assert.rejects(readWorkspaceFile(root, '.env'), /范围/);
  const outside = path.join(directory, 'external');
  await mkdir(outside);
  await writeFile(path.join(outside, 'external.js'), 'outside');
  await symlink(outside, path.join(root, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(readWorkspaceFile(root, 'linked/external.js'), /范围/);
});

test('HTML source scripts and network-capable markup are removed', () => {
  const output = sanitizeDesign('<html><head><base href="https://example.org"><link rel="stylesheet" href="https://example.org/a.css"></head><body onload="alert(1)"><script>bad()</script><iframe srcdoc="bad"></iframe><img src="https://example.org/pixel"><a href="javascript:bad()">A</a><form action="https://example.org"></form></body></html>');
  assert.doesNotMatch(output, /<script|<iframe|<base|<link|onload|javascript:|https:\/\//i);
});

test('generation verifies paths and selectors and rejects stale revisions', async t => {
  const { root } = await fixture(t);
  const sessions = new Sessions();
  const session = sessions.create();
  await sessions.bind(session.id, root);
  sessions.setSource(session.id, source);
  let state = sessions.begin(session.id);
  await assert.rejects(sessions.publish(session.id, state.revision, source.content, [{ ...mapping, sourcePath: 'src/missing.vue' }]));
  await assert.rejects(sessions.publish(session.id, state.revision, source.content, [{ ...mapping, selector: '.missing' }]), /精确/);
  await assert.rejects(sessions.publish(session.id, state.revision, source.content, [{ ...mapping, kind: 'library', packageName: 'uninstalled-ui' }]), /包清单/);
  sessions.setSource(session.id, source);
  await assert.rejects(sessions.publish(session.id, state.revision, source.content, [mapping]), /过期/);
  state = sessions.begin(session.id);
  await sessions.publish(session.id, state.revision, source.content, [mapping]);
  const ready = sessions.snapshot(session.id, true);
  assert.equal(ready.status, 'ready');
  assert.match(ready.previewHtml, /app-button/);
  assert.match(ready.exportHtml, /src\/components\/app-button\/index.vue/);
  assert.match(ready.exportHtml, /sandbox="allow-scripts"/);
});

test('built MCP server exposes app resource and completes a real tool round trip', async t => {
  const { root } = await fixture(t);
  const transport = new StdioClientTransport({ command: process.execPath, args: [path.resolve('dist/server.mjs')], cwd: process.cwd(), stderr: 'pipe' });
  const client = new Client({ name: 'ui-reuse-test', version: '1.0.0' });
  t.after(() => client.close());
  await client.connect(transport);
  const tools = await client.listTools();
  assert.ok(tools.tools.find(tool => tool.name === 'open_ui_reuse')._meta.ui.resourceUri);
  const resources = await client.readResource({ uri: 'ui://ui-use-preview/app.html' });
  assert.match(resources.contents[0].text, /生成标注/);
  const opened = await client.callTool({ name: 'open_ui_reuse', arguments: { workspaceRoot: root } });
  assert.equal(opened.isError, undefined);
  const sessionId = opened.structuredContent.sessionId;
  await client.callTool({ name: 'set_design_source', arguments: { sessionId, ...source } });
  const started = await client.callTool({ name: 'begin_annotation', arguments: { sessionId } });
  const published = await client.callTool({ name: 'publish_annotation', arguments: { sessionId, revision: started.structuredContent.revision, html: source.content, annotations: [mapping] } });
  assert.equal(published.structuredContent.status, 'ready');
  const ready = await client.callTool({ name: 'get_panel_state', arguments: { sessionId, withHtml: true } });
  assert.match(ready.structuredContent.exportHtml, /用户补充/);
});
