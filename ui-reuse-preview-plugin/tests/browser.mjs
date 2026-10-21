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
  const designHtml = `<!doctype html><html lang="zh-CN"><head><style>:root{--surface:#fff}body{margin:0;padding:30px;background:#fafafd;font:14px/1.7 system-ui;color:#272936}h1{font-size:22px}p{color:#858697}.toolbar{display:flex;justify-content:space-between;align-items:center;margin:24px 0}button{background:#6554c0;color:white;border:0;border-radius:6px;padding:10px 18px}table{width:100%;border-collapse:collapse;background:var(--surface)}td,th{padding:16px;text-align:left;border-bottom:1px solid #e8e8f0}th{background:#f1eff8;color:#77758a}.note{font-size:12px}</style></head><body><p class="note">演示设计 · 组件路径来自临时测试工作区</p><h1>成员管理</h1><p>管理团队成员与组织信息</p><div class="toolbar"><span>全部成员　12 人</span><button id="invite">邀请成员</button></div><table id="members"><thead><tr><th>成员</th><th>部门</th><th>状态</th></tr></thead><tbody><tr><td>张晓宁</td><td>产品设计</td><td>在职</td></tr><tr><td>陈予安</td><td>前端研发</td><td>在职</td></tr></tbody></table></body></html>`;
  const annotations = [
    { id: 'R01', selector: '#invite', label: '邀请成员按钮', component: 'app-button', kind: 'project', sourcePath: 'src/components/app-button/index.vue', themePath: 'src/styles/theme.css', adaptation: '复用主按钮外观；圆角和颜色通过主题变量对齐。' },
    { id: 'R02', selector: '#members', label: '成员列表', component: 'data-table', kind: 'project', sourcePath: 'src/components/data-table/index.vue', themePath: 'src/styles/theme.css', adaptation: '复用已有表格，调整表头背景和行高；仅确认 UI 匹配。' }
  ];
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, acceptDownloads: true });
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error') console.error('Browser console:', message.text()); });
  await page.exposeFunction('hostTool', async params => client.callTool(params));
  await page.exposeFunction('hostMessage', async () => {
    const state = await client.callTool({ name: 'get_panel_state', arguments: { sessionId } });
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
  await app.locator('#source').setInputFiles({ name: 'member-design.html', mimeType: 'text/html', buffer: Buffer.from(designHtml) });
  await app.getByRole('button', { name: '生成标注', exact: true }).click();
  await app.locator('.reuse-card').first().waitFor();
  assert.equal(await app.locator('.reuse-card').count(), 2);
  assert.equal(await app.locator('.ui-reuse-marker').count(), 2);
  await app.locator('.ui-reuse-marker').first().evaluate(element => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(element.getBoundingClientRect().width)))));
  await app.locator('body.reuse-app').screenshot({ path: path.join(results, 'preview-desktop.png') });
  const downloadPromise = page.waitForEvent('download');
  await app.getByRole('button', { name: '下载标注 HTML' }).click();
  const download = await downloadPromise;
  const exportPath = path.join(results, 'annotated-example.html');
  await download.saveAs(exportPath);
  const exportPage = await browser.newPage();
  await exportPage.goto(new URL(`file:///${exportPath.replaceAll('\\', '/')}`).href);
  await exportPage.frameLocator('iframe').locator('.ui-reuse-marker').first().waitFor();
  assert.equal(await exportPage.frameLocator('iframe').locator('.ui-reuse-marker').count(), 2);
  await page.setViewportSize({ width: 375, height: 812 });
  await app.locator('body.reuse-app').screenshot({ path: path.join(results, 'preview-mobile.png') });
  const overflow = await app.locator('body.reuse-app').evaluate(element => element.scrollWidth > window.innerWidth);
  assert.equal(overflow, false);
  assert.deepEqual(failures, []);
  console.log('Browser checks passed: upload, host message, real publish, inline markers, HTML download, exported markers, narrow layout.');
} finally {
  await browser?.close();
  await client?.close();
  await rm(temporary, { recursive: true, force: true });
}
