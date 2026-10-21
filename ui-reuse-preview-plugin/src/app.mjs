import { App, applyDocumentTheme, applyHostStyleVariables } from '@modelcontextprotocol/ext-apps';
import { OpenAIExtensions } from '@openai/mcp-extensions/app';
import { mountAnnotations } from './annotations.mjs';

const app = new App({ name: 'ui-use-preview', version: '0.1.1' });
const extensions = new OpenAIExtensions(app);
const elements = Object.fromEntries(['workspace', 'choose', 'source', 'filename', 'generate', 'download', 'status', 'empty', 'preview', 'preview-caption', 'count', 'annotations'].map(id => [id, document.getElementById(id)]));
let state;
let exportHtml = '';
let timer;
let disposed = false;
let bindRequested = false;
let pollStarted = 0;
let disposePreview;
const previewRoot = elements.preview.attachShadow({ mode: 'open' });
previewRoot.addEventListener('submit', event => event.preventDefault());
previewRoot.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault(); });

function renderDesign(html, annotations) {
  const documentPreview = new DOMParser().parseFromString(html, 'text/html');
  documentPreview.querySelectorAll('script, meta, iframe, object, embed, base, link').forEach(node => node.remove());
  documentPreview.querySelectorAll('style').forEach(node => { node.textContent = node.textContent.replace(/:root\b/g, ':host'); });
  disposePreview?.();
  previewRoot.replaceChildren(document.adoptNode(documentPreview.documentElement));
  disposePreview = mountAnnotations(previewRoot, annotations, elements.preview);
}

async function call(name, args) {
  const response = await app.callServerTool({ name, arguments: args });
  if (response.isError) throw new Error(response.content?.find(item => item.type === 'text')?.text || '插件操作失败。');
  return response.structuredContent;
}

function status(message, error = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle('reuse-status-error', error);
}

function renderAnnotations(annotations) {
  elements.annotations.replaceChildren();
  elements.count.textContent = String(annotations.length);
  for (const annotation of annotations) {
    const card = document.createElement('article');
    card.className = 'reuse-card';
    const heading = document.createElement('h3');
    heading.textContent = `${annotation.id} · ${annotation.component}`;
    card.append(heading);
    const rows = [
      ['区域', annotation.label],
      ['来源', annotation.sourcePath || annotation.packageName || '未找到匹配项'],
      ['证据', annotation.evidencePath || '未提供'],
      ['主题', annotation.themePath || '无需调整或待定位'],
      ['适配', annotation.adaptation]
    ];
    const kind = document.createElement('p');
    kind.className = 'reuse-kind';
    kind.textContent = { project: '项目公共组件', library: '组件库', unresolved: '未找到匹配项' }[annotation.kind];
    card.append(kind);
    for (const [label, value] of rows) {
      const row = document.createElement('p');
      row.append(`${label}：`);
      const text = document.createElement(label === '来源' || label === '证据' || label === '主题' ? 'code' : 'span');
      text.textContent = value;
      row.append(text);
      card.append(row);
    }
    elements.annotations.append(card);
  }
}

function render(next) {
  if (!next?.sessionId) return;
  state = next;
  elements.workspace.textContent = next.workspaceName ? `当前工作区 · ${next.workspaceName}` : '正在关联当前工作区…';
  elements.filename.textContent = next.source?.name || 'HTML、PNG、JPG、WebP · 最大 8 MiB';
  const processing = next.status === 'processing';
  elements.source.disabled = !next.workspaceName || processing;
  elements.choose.disabled = elements.source.disabled;
  elements.generate.disabled = !next.source || processing;
  elements.generate.textContent = processing ? '正在生成…' : '生成标注';
  elements.download.disabled = next.status !== 'ready' || !exportHtml;
  status(next.message, next.status === 'error');
  if (next.previewHtml) {
    renderDesign(next.previewHtml, next.annotations);
    elements.preview.hidden = false;
    elements.empty.hidden = true;
    elements['preview-caption'].textContent = '静态标注预览 · UI 组件未实际挂载';
    exportHtml = next.exportHtml;
    elements.download.disabled = false;
    renderAnnotations(next.annotations);
  } else if (next.status === 'idle' && !next.annotations?.length) {
    exportHtml = '';
    disposePreview?.();
    previewRoot.replaceChildren();
    elements.preview.hidden = true;
    elements.empty.hidden = false;
    renderAnnotations([]);
  }
}

async function send(text) {
  const params = { role: 'user', content: [{ type: 'text', text }] };
  const response = extensions.message ? await extensions.message.send(params) : await app.sendMessage(params);
  if (response?.isError) throw new Error('宿主未能启动 agent，请在当前会话中发送生成请求。');
}

function schedulePoll() {
  clearTimeout(timer);
  if (disposed || !state) return;
  timer = setTimeout(async () => {
    try {
      const next = await call('get_panel_state', { sessionId: state.sessionId });
      if (next.status === 'ready') render(await call('get_panel_state', { sessionId: state.sessionId, withHtml: true }));
      else render(next);
      if (next.status === 'binding' || next.status === 'processing') {
        if (Date.now() - pollStarted > 15 * 60 * 1000) {
          status('暂未收到 agent 结果。可在当前会话继续处理，再重新打开面板。', true);
          elements.generate.disabled = false;
        } else schedulePoll();
      }
    } catch (error) { status(error.message, true); }
  }, 1800);
}

async function initializePanel(next) {
  render(next);
  if (next.status === 'binding' && !bindRequested) {
    bindRequested = true;
    await send(`请使用 ui-use-preview 插件，将面板 ${next.sessionId} 关联到本会话的真实工作区：调用 bind_workspace(sessionId, workspaceRoot)。从当前会话环境获取绝对路径，不要使用插件安装目录，不需要向用户展示仓库选择器。关联完成后等待用户在插件中选择文件。`);
    pollStarted = Date.now();
    schedulePoll();
  }
}

elements.choose.addEventListener('click', () => elements.source.click());
elements.source.addEventListener('change', async () => {
  const file = elements.source.files?.[0];
  if (!file || !state) return;
  try {
    if (file.size > 8 * 1024 * 1024) throw new Error('文件不能超过 8 MiB。');
    const extension = file.name.split('.').pop().toLowerCase();
    const mimeType = { html: 'text/html', htm: 'text/html', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }[extension];
    if (!mimeType) throw new Error('请选择 HTML、PNG、JPG 或 WebP。');
    let content;
    if (mimeType === 'text/html') content = await file.text();
    else content = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(new Error('图片读取失败。'));
      reader.readAsDataURL(file);
    });
    render(await call('set_design_source', { sessionId: state.sessionId, name: file.name, mimeType, content }));
  } catch (error) { status(error.message, true); }
  finally { elements.source.value = ''; }
});

elements.generate.addEventListener('click', async () => {
  if (!state) return;
  try {
    render(await call('begin_annotation', { sessionId: state.sessionId }));
    await send(`使用插件中的 ui-reuse-annotation skill 为面板 ${state.sessionId} 生成 UI 复用标注，当前 revision=${state.revision}。调用 read_design_source 读取已选文件；调用 scan_workspace_ui 和 read_ui_source 检查当前工作区的公共 UI 组件、主组件库及主题。仅分析 UI，不分析接口、业务流程、权限或提交逻辑。将设计图片还原为 HTML，或在原 HTML 基础上补充，最后调用 publish_annotation 将完整 HTML 和选择器标注发布到本面板。组件路径必须真实存在；弹窗、抽屉、Toast、表格和树也必须优先复用，视觉差异用主题适配。出现阻塞时调用 report_annotation_error。不要创建其他网页或要求用户打开外部 HTML。`);
    pollStarted = Date.now();
    schedulePoll();
  } catch (error) {
    if (state?.status === 'processing') {
      try { render(await call('report_annotation_error', { sessionId: state.sessionId, revision: state.revision, message: error.message })); }
      catch { status(error.message, true); }
    } else status(error.message, true);
  }
});

elements.download.addEventListener('click', () => {
  if (!exportHtml) return;
  const url = URL.createObjectURL(new Blob([exportHtml], { type: 'text/html;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${state.source.name.replace(/\.[^.]+$/, '')}-ui-reuse.html`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

function applyContext(context) {
  if (context?.theme) applyDocumentTheme(context.theme);
  if (context?.styles?.variables) applyHostStyleVariables(context.styles.variables);
}

app.ontoolresult = next => { initializePanel(next.structuredContent).catch(error => status(error.message, true)); };
app.onhostcontextchanged = context => applyContext(context);
function dispose() { disposed = true; clearTimeout(timer); disposePreview?.(); }
window.addEventListener('pagehide', dispose);
app.onteardown = async () => { dispose(); return {}; };
async function connect() {
  try {
    await app.connect();
    applyContext(app.getHostContext());
  } catch (error) { status(`无法连接插件宿主：${error.message}`, true); }
}
connect();
