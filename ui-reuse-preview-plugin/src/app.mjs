import { App, applyDocumentTheme, applyHostStyleVariables } from '@modelcontextprotocol/ext-apps';
import { OpenAIExtensions } from '@openai/mcp-extensions/app';
import { mountAnnotations } from './annotations.mjs';

const app = new App({ name: 'ui-use-preview', version: '0.2.0' });
const extensions = new OpenAIExtensions(app);
const ids = ['workspace', 'source', 'upload', 'download', 'reset', 'stage', 'progress', 'progress-file', 'progress-text', 'doc', 'doc-url', 'preview', 'canvas-hint', 'zoom-group', 'zoom-in', 'zoom-out', 'zoom-value', 'count', 'filter', 'list-empty', 'annotations', 'filter-empty', 'summary', 'status', 'retry', 'toast', 'toast-text'];
const elements = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const previewRoot = elements.preview.attachShadow({ mode: 'open' });
const labels = { reuse: '复用', adapt: '需适配', new: '建议新建' };
let state;
let exportHtml = '';
let timer;
let toastTimer;
let disposed = false;
let bindRequested = false;
let pollStarted = 0;
let preview;
let uploading = false;
let activeId = null;
let filter = 'all';
let zoom = 100;

previewRoot.addEventListener('submit', event => event.preventDefault());
previewRoot.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault(); });

function recommendation(annotation) {
  return annotation.recommendation || (annotation.kind === 'unresolved' ? 'new' : 'reuse');
}

function toast(message) {
  clearTimeout(toastTimer);
  elements['toast-text'].textContent = message;
  elements.toast.hidden = false;
  toastTimer = setTimeout(() => { elements.toast.hidden = true; }, 2600);
}

function status(message, error = false) {
  elements.status.textContent = message;
  elements.status.hidden = !message;
  elements.status.classList.toggle('reuse-status-error', error);
}

async function call(name, args) {
  const response = await app.callServerTool({ name, arguments: args });
  if (response.isError) throw new Error(response.content?.find(item => item.type === 'text')?.text || '插件操作失败。');
  return response.structuredContent;
}

async function send(text) {
  const params = { role: 'user', content: [{ type: 'text', text }] };
  const response = extensions.message ? await extensions.message.send(params) : await app.sendMessage(params);
  if (response?.isError) throw new Error('宿主未能启动 agent，请在当前会话中发送生成请求。');
}

function setZoom(value) {
  zoom = Math.max(70, Math.min(140, value));
  elements['zoom-value'].textContent = `${zoom}%`;
  elements.doc.style.zoom = String(zoom / 100);
  elements['zoom-in'].disabled = zoom === 140;
  elements['zoom-out'].disabled = zoom === 70;
  preview?.reposition();
}

function activate(id, scrollToTarget = false) {
  activeId = id;
  preview?.select(id, scrollToTarget);
  for (const item of elements.annotations.children) {
    const selected = item.dataset.id === id;
    item.classList.toggle('reuse-card-active', selected);
    item.setAttribute('aria-pressed', String(selected));
    item.querySelector('.reuse-card-detail').hidden = !selected;
    if (selected && !scrollToTarget) item.scrollIntoView({ block: 'nearest' });
  }
  const annotation = state?.annotations?.find(item => item.id === id);
  elements['canvas-hint'].classList.toggle('reuse-hint-active', Boolean(annotation));
  elements['canvas-hint'].textContent = annotation ? `${annotation.id} · ${annotation.component}` : state?.source ? `${state.source.name} · ${state.annotations.length} 处标注` : '选择文件后自动生成标注';
}

function applyFilter(value) {
  filter = value;
  for (const button of elements.filter.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.filter === value));
  let visible = 0;
  for (const item of elements.annotations.children) {
    item.hidden = value !== 'all' && item.dataset.kind !== value;
    if (!item.hidden) visible += 1;
  }
  elements['filter-empty'].hidden = visible > 0 || !state?.annotations?.length;
  preview?.filter(value);
  activate(null);
}

function renderAnnotations(annotations) {
  elements.annotations.replaceChildren();
  const counts = { all: annotations.length, reuse: 0, adapt: 0, new: 0 };
  for (const annotation of annotations) {
    const kind = recommendation(annotation);
    counts[kind] += 1;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'reuse-card';
    item.dataset.id = annotation.id;
    item.dataset.kind = kind;
    item.setAttribute('aria-pressed', 'false');
    const number = document.createElement('span');
    number.className = 'reuse-card-number';
    number.textContent = annotation.id.replace(/^R/, '');
    const content = document.createElement('span');
    content.className = 'reuse-card-content';
    const name = document.createElement('span');
    name.className = 'reuse-card-name';
    name.append(annotation.label);
    const tag = document.createElement('span');
    tag.className = 'reuse-card-tag';
    tag.dataset.kind = kind;
    tag.textContent = labels[kind];
    name.append(tag);
    const sourcePath = document.createElement('span');
    sourcePath.className = 'reuse-card-path';
    sourcePath.textContent = annotation.sourcePath || annotation.packageName || '未找到匹配组件';
    const note = document.createElement('span');
    note.className = 'reuse-card-note';
    note.textContent = annotation.adaptation || '沿用现有 UI';
    const detail = document.createElement('span');
    detail.className = 'reuse-card-detail';
    detail.hidden = true;
    detail.textContent = `组件：${annotation.component}；来源：${{ project: '项目公共组件', library: '组件库', unresolved: '未匹配' }[annotation.kind]}；用法证据：${annotation.evidencePath || '未提供'}；主题：${annotation.themePath || '无需调整或待定位'}`;
    content.append(name, sourcePath, note, detail);
    const arrow = document.createElement('span');
    arrow.className = 'reuse-card-arrow';
    arrow.textContent = '›';
    arrow.setAttribute('aria-hidden', 'true');
    item.append(number, content, arrow);
    elements.annotations.append(item);
  }
  elements.count.textContent = String(counts.all);
  elements.count.classList.toggle('reuse-count-live', counts.all > 0);
  for (const counter of elements.filter.querySelectorAll('[data-count]')) counter.textContent = String(counts[counter.dataset.count]);
  elements.summary.textContent = `${counts.reuse} 处可复用 · ${counts.adapt} 处需适配 · ${counts.new} 处建议新建`;
  const ready = state?.status === 'ready';
  elements.filter.hidden = !ready || counts.all === 0;
  elements.annotations.hidden = !ready;
  elements['list-empty'].hidden = ready;
  elements.summary.hidden = !ready;
  applyFilter(filter);
}

function renderDesign(html, annotations) {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  parsed.querySelectorAll('script, meta, iframe, object, embed, base, link').forEach(node => node.remove());
  parsed.querySelectorAll('style').forEach(node => { node.textContent = node.textContent.replace(/:root\b/g, ':host'); });
  preview?.();
  previewRoot.replaceChildren(document.adoptNode(parsed.documentElement));
  preview = mountAnnotations(previewRoot, annotations, elements.preview, id => {
    const annotation = annotations.find(item => item.id === id);
    if (annotation && filter !== 'all' && recommendation(annotation) !== filter) applyFilter('all');
    activate(id);
  });
}

function render(next) {
  if (!next?.sessionId) return;
  state = next;
  const processing = next.status === 'processing';
  const ready = next.status === 'ready';
  const failed = next.status === 'error';
  elements.workspace.textContent = next.workspaceName ? `当前工作区 · ${next.workspaceName}` : '正在关联当前工作区…';
  elements.source.disabled = !next.workspaceName || uploading;
  elements.upload.disabled = elements.source.disabled;
  elements.upload.hidden = Boolean(next.source) || uploading;
  elements.reset.hidden = !next.source && !uploading;
  elements.reset.disabled = uploading;
  elements.progress.hidden = !processing && !uploading;
  elements['progress-file'].textContent = next.source?.name || '';
  elements['progress-text'].textContent = next.message;
  elements.doc.hidden = !ready;
  elements.download.hidden = !ready;
  elements['zoom-group'].hidden = !ready;
  elements.retry.hidden = !failed || !next.source;
  elements.stage.classList.toggle('reuse-stage-filled', ready);
  elements['canvas-hint'].textContent = processing ? '正在生成标注…' : next.source?.name || '选择文件后自动生成标注';
  elements['canvas-hint'].classList.toggle('reuse-hint-active', processing);
  status(failed ? next.message : '');
  if (ready && next.previewHtml) {
    exportHtml = next.exportHtml;
    elements['doc-url'].textContent = `${next.workspaceName} / ${next.source.name}`;
    renderDesign(next.previewHtml, next.annotations);
    renderAnnotations(next.annotations);
    setZoom(zoom);
  } else if (!ready) {
    exportHtml = '';
    preview?.();
    preview = undefined;
    previewRoot.replaceChildren();
    renderAnnotations([]);
    if (processing) {
      elements['list-empty'].querySelector('h3').textContent = '正在查找可复用 UI';
      elements['list-empty'].querySelector('p').textContent = '生成完成后，组件路径和适配建议会显示在这里。';
    } else {
      elements['list-empty'].querySelector('h3').textContent = '还没有标注';
      elements['list-empty'].querySelector('p').textContent = '选择设计稿后会自动生成清单，编号与画布上的标记一一对应。';
    }
  }
}

function schedulePoll() {
  clearTimeout(timer);
  if (disposed || !state) return;
  const sessionId = state.sessionId;
  const revision = state.revision;
  timer = setTimeout(async () => {
    try {
      let next = await call('get_panel_state', { sessionId });
      if (disposed || state.sessionId !== sessionId || state.revision !== revision) return;
      if (next.status === 'ready') next = await call('get_panel_state', { sessionId, withHtml: true });
      if (disposed || state.sessionId !== sessionId || state.revision !== revision) return;
      render(next);
      if (next.status === 'ready') toast(`已生成 ${next.annotations.length} 处 UI 复用标注`);
      if (next.status === 'binding' || next.status === 'processing') {
        if (Date.now() - pollStarted > 15 * 60 * 1000) {
          if (next.status === 'processing') render(await call('report_annotation_error', { sessionId, revision: next.revision, message: '暂未收到生成结果，请重试或在当前会话继续处理。' }));
          else status('未能自动关联工作区，请让当前 agent 调用 bind_workspace 关联本面板。', true);
        } else schedulePoll();
      }
    } catch (error) { status(error.message, true); }
  }, 1200);
}

async function initializePanel(next) {
  render(next);
  if (next?.status === 'binding' && !bindRequested) {
    bindRequested = true;
    pollStarted = Date.now();
    schedulePoll();
    await send(`请使用 ui-use-preview 插件，将面板 ${next.sessionId} 关联到本会话的真实工作区：调用 bind_workspace(sessionId, workspaceRoot)。从当前会话环境获取绝对路径，不要使用插件安装目录，不需要向用户展示仓库选择器。关联完成后等待用户在插件中选择文件。`);
  }
}

async function generate() {
  if (!state?.source) return;
  let generation;
  try {
    generation = await call('begin_annotation', { sessionId: state.sessionId });
    render(generation);
    pollStarted = Date.now();
    schedulePoll();
    await send(`使用插件中的 ui-reuse-annotation skill 为面板 ${generation.sessionId} 生成 UI 复用标注，当前 revision=${generation.revision}。调用 read_design_source 读取用户刚选择的文件；调用 scan_workspace_ui 和 read_ui_source 检查当前工作区的公共 UI 组件、主组件库及主题。仅分析 UI。将设计图片还原为 HTML，或在原 HTML 基础上补充，最后调用 publish_annotation 将完整 HTML 和选择器标注发布到本面板。每个标注填写 recommendation：reuse（直接复用）、adapt（需 UI/主题适配）、new（无匹配项，建议共享封装）。kind 仍用于区分 project/library/unresolved。路径必须真实存在；弹窗、抽屉、Toast、表格和树也优先复用，视觉差异用主题适配。出现阻塞时调用 report_annotation_error。无需用户再次确认生成，不要创建其他预览网站。`);
  } catch (error) {
    if (generation && (state?.sessionId !== generation.sessionId || state?.revision !== generation.revision)) return;
    if (generation && state?.status === 'processing') {
      try { render(await call('report_annotation_error', { sessionId: generation.sessionId, revision: generation.revision, message: error.message })); }
      catch { status(error.message, true); }
    } else if (state?.status !== 'ready') status(error.message, true);
  }
}

async function selectFile(file) {
  if (!file || !state) return;
  if (!state.workspaceName) { toast('工作区尚未关联，请稍候。'); return; }
  if (uploading) return;
  try {
    if (!file.size || file.size > 8 * 1024 * 1024) throw new Error('请选择非空且不超过 8 MiB 的文件。');
    const extension = file.name.split('.').pop().toLowerCase();
    const mimeType = { html: 'text/html', htm: 'text/html', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }[extension] || (['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ? file.type : undefined);
    if (!mimeType) throw new Error('请选择 HTML、PNG、JPG 或 WebP。');
    uploading = true;
    clearTimeout(timer);
    elements.upload.disabled = true;
    elements.source.disabled = true;
    elements['progress-file'].textContent = file.name || 'pasted-image.png';
    elements['progress-text'].textContent = '读取设计文件…';
    elements.progress.hidden = false;
    elements.upload.hidden = true;
    elements.doc.hidden = true;
    elements.reset.disabled = true;
    elements.stage.classList.remove('reuse-stage-filled');
    let content;
    if (mimeType === 'text/html') content = await file.text();
    else content = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(new Error('图片读取失败。'));
      reader.readAsDataURL(file);
    });
    const next = await call('set_design_source', { sessionId: state.sessionId, name: file.name || 'pasted-image.png', mimeType, content });
    uploading = false;
    zoom = 100;
    filter = 'all';
    render(next);
    await generate();
  } catch (error) {
    uploading = false;
    if (state) render(state);
    status(error.message, true);
    toast(error.message);
  } finally { elements.source.value = ''; }
}

elements.upload.addEventListener('click', () => elements.source.click());
elements.source.addEventListener('change', () => selectFile(elements.source.files?.[0]));
elements.retry.addEventListener('click', generate);
elements.reset.addEventListener('click', async () => {
  if (!state || uploading) return;
  try {
    clearTimeout(timer);
    render(await call('reset_design_source', { sessionId: state.sessionId }));
    zoom = 100;
    filter = 'all';
    activeId = null;
    setZoom(100);
    toast('已清空设计稿，可重新选择文件。');
  } catch (error) { status(error.message, true); }
});
elements.stage.addEventListener('dragover', event => {
  event.preventDefault();
  if (state?.workspaceName && !uploading) {
    elements.stage.classList.add('reuse-stage-drag');
    elements.upload.classList.add('reuse-upload-drag');
  }
});
elements.stage.addEventListener('dragleave', event => {
  if (!elements.stage.contains(event.relatedTarget)) {
    elements.stage.classList.remove('reuse-stage-drag');
    elements.upload.classList.remove('reuse-upload-drag');
  }
});
elements.stage.addEventListener('drop', event => {
  event.preventDefault();
  elements.stage.classList.remove('reuse-stage-drag');
  elements.upload.classList.remove('reuse-upload-drag');
  selectFile(event.dataTransfer?.files?.[0]);
});
document.addEventListener('paste', event => {
  const file = event.clipboardData?.files?.[0];
  if (file) { event.preventDefault(); selectFile(file); }
});
elements.filter.addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (button) applyFilter(button.dataset.filter);
});
elements.annotations.addEventListener('click', event => {
  const item = event.target.closest('.reuse-card');
  if (item) activate(activeId === item.dataset.id ? null : item.dataset.id, true);
});
elements['zoom-in'].addEventListener('click', () => setZoom(zoom + 10));
elements['zoom-out'].addEventListener('click', () => setZoom(zoom - 10));
elements.download.addEventListener('click', () => {
  if (!exportHtml) return;
  const url = URL.createObjectURL(new Blob([exportHtml], { type: 'text/html;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${state.source.name.replace(/\.[^.]+$/, '')}-ui-reuse.html`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('已开始下载标注 HTML。');
});

function applyContext(context) {
  if (context?.theme) applyDocumentTheme(context.theme);
  if (context?.styles?.variables) applyHostStyleVariables(context.styles.variables);
}

function dispose() {
  disposed = true;
  clearTimeout(timer);
  clearTimeout(toastTimer);
  preview?.();
}

app.ontoolresult = next => { initializePanel(next.structuredContent).catch(error => status(error.message, true)); };
app.onhostcontextchanged = applyContext;
window.addEventListener('pagehide', dispose);
app.onteardown = async () => { dispose(); return {}; };
async function connect() {
  try { await app.connect(); applyContext(app.getHostContext()); }
  catch (error) { status(`无法连接插件宿主：${error.message}`, true); }
}
connect();
