import { chromium } from 'playwright-core';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';

const temporary = await mkdtemp(path.join(os.tmpdir(), 'ui-reuse-browser-'));
const root = path.join(temporary, 'demo-workspace');
const results = path.resolve('test-results');
let browser;
let client;
try {
  await mkdir(path.join(root, 'src/components/app-button'), { recursive: true });
  await mkdir(path.join(root, 'src/components/data-table'), { recursive: true });
  await mkdir(path.join(root, 'src/styles'), { recursive: true });
  await mkdir(results, { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{"dependencies":{"element-plus":"2.8.8"}}');
  await writeFile(path.join(root, 'src/components/app-button/index.vue'), '<template><el-button><slot /></el-button></template>');
  await writeFile(path.join(root, 'src/components/data-table/index.vue'), '<template><el-table /></template>');
  await writeFile(path.join(root, 'src/styles/theme.css'), ':root { --el-color-primary: #6554c0; }');
  client = new Client({ name: 'browser-test', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.resolve('dist/server.mjs')], cwd: process.cwd(), stderr: 'pipe' }));
  const opened = await client.callTool({ name: 'open_ui_reuse', arguments: { workspaceRoot: root } });
  const sessionId = opened.structuredContent.sessionId;
  const designHtml = `<!doctype html><html lang="zh-CN"><head><style>:root{--surface:#fff}body{margin:0;padding:30px;background:white;font:14px/1.7 system-ui;color:#272936}h1{font-size:22px}p{color:#858697}.toolbar{display:flex;justify-content:space-between;align-items:center;margin:24px 0}button{background:#16181d;color:white;border:0;border-radius:6px;padding:10px 18px}table{width:100%;border-collapse:collapse;background:var(--surface)}td,th{padding:16px;text-align:left;border-bottom:1px solid #e8e8f0}th{background:#f4f5f7;color:#77758a}.note{font-size:12px}#visual{margin-top:30px;padding:18px;background:#fafbfc;border:1px solid #e8eaee;border-radius:8px}#visual span{display:block;width:68%;height:6px;background:#c2d2ef;border-radius:4px;margin-top:12px}</style></head><body><p class="note">演示设计 · 组件路径来自临时测试工作区</p><h1>成员管理</h1><p>管理团队成员与组织信息</p><div class="toolbar"><span>全部成员　12 人</span><button id="invite">邀请成员</button></div><table id="members"><thead><tr><th>成员</th><th>部门</th><th>状态</th></tr></thead><tbody><tr><td>张晓宁</td><td>产品设计</td><td>在职</td></tr><tr><td>陈予安</td><td>前端研发</td><td>在职</td></tr></tbody></table><div id="visual">团队概览<span></span></div></body></html>`;
  const annotations = [
    { id: 'R01', selector: '#invite', label: '邀请成员按钮', component: 'app-button', kind: 'project', recommendation: 'reuse', sourcePath: 'src/components/app-button/index.vue', themePath: 'src/styles/theme.css', adaptation: '直接沿用已有主按钮外观与尺寸。' },
    { id: 'R02', selector: '#members', label: '成员列表', component: 'data-table', kind: 'project', recommendation: 'adapt', sourcePath: 'src/components/data-table/index.vue', themePath: 'src/styles/theme.css', adaptation: '复用现有表格，表头背景与行高通过主题对齐。' },
    { id: 'R03', selector: '#visual', label: '团队概览', component: '共享概览展示组件', kind: 'unresolved', recommendation: 'new', adaptation: '未找到匹配展示组件，建议在项目内组合已有图表能力进行共享封装。' }
  ];
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, acceptDownloads: true });
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error') console.error('Browser console:', message.text()); });
  await page.exposeFunction('hostTool', async params => client.callTool(params));
  await page.exposeFunction('hostMessage', async () => {
    const state = await client.callTool({ name: 'get_panel_state', arguments: { sessionId } });
    const source = await client.callTool({ name: 'read_design_source', arguments: { sessionId } });
    if (state.structuredContent.source.mimeType.startsWith('image/')) assert.ok(source.content.find(item => item.type === 'image'));
    await client.callTool({ name: 'scan_workspace_ui', arguments: { sessionId } });
    const published = await client.callTool({ name: 'publish_annotation', arguments: { sessionId, revision: state.structuredContent.revision, html: designHtml, annotations } });
    if (published.isError) throw new Error(published.content[0].text);
    return {};
  });
  await page.setContent('<!doctype html><html><body style="margin:0"><iframe id="app" style="height:1050px;width:100%;border:0" sandbox="allow-scripts allow-downloads"></iframe></body></html>');
  await page.evaluate(initial => {
    const frame = document.getElementById('app');
    window.addEventListener('message', async event => {
      if (event.source !== frame.contentWindow) return;
      const request = event.data;
      if (request.method === 'ui/notifications/initialized') {
        frame.contentWindow.postMessage({ jsonrpc: '2.0', method: 'ui/notifications/tool-result', params: initial }, '*');
        return;
      }
      if (request.method === 'ui/notifications/size-changed' && request.params.height) {
        frame.style.height = `${request.params.height}px`;
        return;
      }
      if (request.id === undefined) return;
      try {
        let result = {};
        if (request.method === 'ui/initialize') result = { protocolVersion: '2026-01-26', hostInfo: { name: 'browser-test', version: '26.1020.0' }, hostCapabilities: { serverTools: {}, message: { text: {} } }, hostContext: { theme: 'light' } };
        else if (request.method === 'tools/call') result = await window.hostTool(request.params);
        else if (request.method === 'ui/message') result = await window.hostMessage(request.params);
        frame.contentWindow.postMessage({ jsonrpc: '2.0', id: request.id, result }, '*');
      } catch (error) { frame.contentWindow.postMessage({ jsonrpc: '2.0', id: request.id, error: { code: -32000, message: error.message } }, '*'); }
    });
  }, opened);
  await page.locator('#app').evaluate((element, html) => { element.srcdoc = html; }, await readFile('dist/app.html', 'utf8'));
  const app = page.frameLocator('#app');
  try { await app.locator('#source:not([disabled])').waitFor({ state: 'attached', timeout: 10000 }); }
  catch (error) { console.error('Browser errors:', failures); console.error(await app.locator('#status').textContent()); throw error; }
  await app.locator('body.reuse-app').screenshot({ path: path.join(results, 'preview-empty.png') });
  await app.locator('#source').setInputFiles({ name: 'member-design.html', mimeType: 'text/html', buffer: Buffer.from(designHtml) });
  await app.locator('#progress').waitFor();
  await app.locator('.reuse-card').first().waitFor();
  assert.equal(await app.locator('.reuse-card').count(), 3);
  assert.equal(await app.locator('.ui-reuse-marker').count(), 3);
  assert.match(await app.locator('#summary').textContent(), /1 处可复用 · 1 处需适配 · 1 处建议新建/);
  await app.locator('.ui-reuse-marker').first().evaluate(element => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(element.getBoundingClientRect().width)))));
  await app.locator('body.reuse-app').screenshot({ path: path.join(results, 'preview-desktop.png') });
  await app.locator('[data-filter="adapt"]').click();
  assert.equal(await app.locator('.reuse-card:visible').count(), 1);
  await app.locator('.reuse-card[data-id="R02"]').click();
  await app.locator('#members[data-ui-reuse-active]').waitFor();
  await app.locator('.ui-reuse-marker[data-id="R01"]').click();
  assert.equal(await app.locator('.reuse-card:visible').count(), 3);
  assert.equal(await app.locator('.reuse-card[data-id="R01"]').getAttribute('aria-pressed'), 'true');
  await app.getByRole('button', { name: '放大', exact: true }).click();
  assert.equal(await app.locator('#zoom-value').textContent(), '110%');
  const alignmentError = await app.locator('#preview').evaluate(element => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
    const marker = element.shadowRoot.querySelector('.ui-reuse-marker[data-id="R01"]').getBoundingClientRect();
    const target = element.shadowRoot.querySelector('#invite').getBoundingClientRect();
    resolve(Math.abs(marker.left - (target.left - 8.8)));
  }))));
  assert.ok(alignmentError < 3, `Marker alignment error at 110%: ${alignmentError}`);
  await app.getByRole('button', { name: '缩小', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await app.getByRole('button', { name: '下载标注', exact: true }).click();
  const download = await downloadPromise;
  const exportPath = path.join(results, 'annotated-example.html');
  await download.saveAs(exportPath);
  const exportPage = await browser.newPage();
  await exportPage.goto(new URL(`file:///${exportPath.replaceAll('\\', '/')}`).href);
  await exportPage.frameLocator('iframe').locator('.ui-reuse-marker').first().waitFor();
  assert.equal(await exportPage.frameLocator('iframe').locator('.ui-reuse-marker').count(), 3);
  await page.setViewportSize({ width: 375, height: 812 });
  await app.locator('body.reuse-app').screenshot({ path: path.join(results, 'preview-mobile.png') });
  const overflow = await app.locator('body.reuse-app').evaluate(element => element.scrollWidth > window.innerWidth);
  assert.equal(overflow, false);
  await app.getByRole('button', { name: '重新选择设计稿' }).click();
  await app.locator('#upload').waitFor();
  let panelState = await client.callTool({ name: 'get_panel_state', arguments: { sessionId } });
  assert.equal(panelState.structuredContent.source, null);
  await app.locator('#stage').evaluate((element, html) => {
    const data = new DataTransfer();
    data.items.add(new File([html], 'dropped.html', { type: 'text/html' }));
    element.dispatchEvent(new DragEvent('drop', { dataTransfer: data, bubbles: true, cancelable: true }));
  }, designHtml);
  await app.locator('.reuse-card').first().waitFor();
  panelState = await client.callTool({ name: 'get_panel_state', arguments: { sessionId } });
  assert.equal(panelState.structuredContent.source.name, 'dropped.html');
  await app.getByRole('button', { name: '重新选择设计稿' }).click();
  await app.locator('#upload').waitFor();
  await app.locator('body.reuse-app').evaluate(() => {
    const data = new DataTransfer();
    const binary = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/b9sAAAAASUVORK5CYII=');
    data.items.add(new File([Uint8Array.from(binary, character => character.charCodeAt(0))], 'pasted-image.png', { type: 'image/png' }));
    document.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
  });
  await app.locator('.reuse-card').first().waitFor();
  panelState = await client.callTool({ name: 'get_panel_state', arguments: { sessionId } });
  assert.equal(panelState.structuredContent.source.mimeType, 'image/png');
  assert.deepEqual(failures, []);
  console.log('Browser checks passed: automatic generation, real MCP publish, filters, bidirectional selection, zoom alignment, download, exported markers, reset, drag/drop, pasted image and narrow layout.');
} finally {
  await browser?.close();
  await client?.close();
  await rm(temporary, { recursive: true, force: true });
}
