import { parse, serialize } from 'parse5';
import { mountAnnotations } from './annotations.mjs';

export function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

const forbiddenTags = new Set(['script', 'iframe', 'object', 'embed', 'base', 'link', 'meta', 'portal']);

export function sanitizeDesign(source) {
  const document = parse(source);
  function clean(node) {
    if (!node.childNodes) return;
    node.childNodes = node.childNodes.filter(child => !forbiddenTags.has(child.tagName));
    for (const child of node.childNodes) {
      if (child.attrs) child.attrs = child.attrs.filter(attribute => {
        const name = attribute.name.toLowerCase();
        if (name.startsWith('on') || ['action', 'formaction', 'srcdoc', 'target', 'download', 'ping', 'srcset', 'xlink:href'].includes(name)) return false;
        if (['src', 'href'].includes(name)) return name === 'src' && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(attribute.value);
        return true;
      });
      clean(child);
      if (child.content) clean(child.content);
    }
  }
  clean(document);
  return serialize(document);
}

export function renderPreview(source, annotations, nonce) {
  const sanitized = sanitizeDesign(source);
  const data = JSON.stringify(annotations).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
  const policy = `default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; form-action 'none'; base-uri 'none'`;
  const bootstrap = `<meta http-equiv="Content-Security-Policy" content="${policy}"><style>
  [data-ui-reuse-target] { outline: 1px dashed rgba(0,82,217,.45); outline-offset: 5px; }
  [data-ui-reuse-target][data-ui-reuse-active] { outline-color: #0052d9; outline-width: 2px; }
  .ui-reuse-overlay { position: absolute; top: 0; left: 0; z-index: 2147483647; pointer-events: none; width: 100%; }
  .ui-reuse-overlay .ui-reuse-marker { position: absolute; pointer-events: auto; cursor: pointer; height: 20px; width: 20px; margin: 0; padding: 0; background: #0052d9; border: 0; border-radius: 50%; box-shadow: 0 0 0 2px #fff; font: 700 9px/20px system-ui,sans-serif; color: #fff; text-align: center; display: block; }
  .ui-reuse-overlay .ui-reuse-marker[aria-pressed="true"] { box-shadow: 0 0 0 3px #bfd3fa; transform: scale(1.15); }
  .ui-reuse-overlay .ui-reuse-marker.ui-reuse-marker-muted, .ui-reuse-overlay .ui-reuse-marker.ui-reuse-marker-filtered { background: #c9ced7; }
  .ui-reuse-overlay .ui-reuse-marker:focus-visible { outline: 2px solid #0052d9; outline-offset: 3px; }
  .ui-reuse-missing { margin: 12px; padding: 12px; background: #fff6df; font: 13px/1.6 system-ui,sans-serif; color: #68480c; }
  </style>`;
  const script = `<script nonce="${nonce}">
  (${mountAnnotations.toString()})(document, ${data});
  document.addEventListener('submit', event => event.preventDefault());
  document.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault(); });
  <\/script>`;
  return sanitized.replace(/<head[^>]*>/i, match => match + bootstrap).replace('</body>', script + '</body>');
}

export function renderExport(previewHtml, annotations, workspaceName, sourceName, nonce) {
  const cards = annotations.map(annotation => `<article><h2>${escapeHtml(annotation.id)} · ${escapeHtml(annotation.component)}</h2><p>${escapeHtml(annotation.label)}</p><p>来源：<code>${escapeHtml(annotation.sourcePath || annotation.packageName || '未找到匹配项')}</code></p><p>用法证据：<code>${escapeHtml(annotation.evidencePath || '未提供')}</code></p><p>主题：<code>${escapeHtml(annotation.themePath || '无需调整或待定位')}</code></p><p>适配：${escapeHtml(annotation.adaptation)}</p><p>用户补充：________________</p></article>`).join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; frame-src 'self'; img-src data:"><title>UI 复用标注</title><style>body{margin:0;background:#f6f7fb;color:#252635;font:14px/1.7 system-ui,sans-serif}header{padding:20px 28px;background:white;border-bottom:1px solid #e5e5ef}h1{margin:0;font-size:22px}main{display:flex;flex-wrap:wrap;gap:20px;padding:20px}iframe{height:900px;min-width:300px;flex:1;border:1px solid #e5e5ef;border-radius:10px;background:white}aside{width:330px;max-width:100%}article{padding:16px;margin-bottom:12px;background:white;border:1px solid #e5e5ef;border-radius:10px}h2{font-size:15px}p{margin:8px 0}code{overflow-wrap:anywhere;color:#5545bd}</style></head><body><header><h1>UI 复用标注</h1><p>${escapeHtml(workspaceName)} · ${escapeHtml(sourceName)} · 仅分析 UI；静态预览不代表组件已经运行</p></header><main><iframe title="带标注的设计预览" sandbox="allow-scripts" srcdoc="${escapeHtml(previewHtml)}"></iframe><aside>${cards}</aside></main></body></html>`;
}
