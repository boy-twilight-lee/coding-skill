export function mountAnnotations(root, annotations, viewport, onSelect) {
  const ownerDocument = root.ownerDocument || root;
  const overlay = ownerDocument.createElement('div');
  overlay.className = 'ui-reuse-overlay';
  const pairs = [];
  const missing = [];
  for (const annotation of annotations) {
    let target;
    try { target = root.querySelector(annotation.selector); } catch { target = null; }
    if (!target) { missing.push(annotation.id); continue; }
    target.setAttribute('data-ui-reuse-target', annotation.id);
    const marker = ownerDocument.createElement('button');
    marker.type = 'button';
    marker.className = 'ui-reuse-marker';
    marker.textContent = annotation.id.replace(/^R/, '');
    marker.dataset.id = annotation.id;
    marker.setAttribute('aria-label', `${annotation.id} · ${annotation.component}`);
    marker.setAttribute('aria-pressed', 'false');
    marker.title = annotation.sourcePath || annotation.packageName || '未找到匹配项';
    overlay.append(marker);
    pairs.push({ target, marker, annotation });
  }
  (root.nodeType === 9 ? root.documentElement : root).append(overlay);
  let frame;
  function position() {
    const origin = viewport?.getBoundingClientRect() || { left: 0, top: 0 };
    const scale = viewport?.offsetWidth ? origin.width / viewport.offsetWidth : 1;
    for (const { target, marker } of pairs) {
      const bounds = target.getBoundingClientRect();
      marker.style.left = `${Math.max(0, (bounds.left - origin.left) / scale + (viewport ? viewport.scrollLeft : window.scrollX) - 8)}px`;
      marker.style.top = `${Math.max(0, (bounds.top - origin.top) / scale + (viewport ? viewport.scrollTop : window.scrollY) - 8)}px`;
    }
  }
  function select(id, scroll = false, notify = false) {
    for (const { target, marker, annotation } of pairs) {
      const active = annotation.id === id;
      target.toggleAttribute('data-ui-reuse-active', active);
      marker.setAttribute('aria-pressed', String(active));
      marker.classList.toggle('ui-reuse-marker-muted', Boolean(id) && !active);
      if (active && scroll) target.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
    if (notify) onSelect?.(id);
  }
  function handleClick(event) {
    const marker = event.target.closest?.('.ui-reuse-marker');
    const target = event.target.closest?.('[data-ui-reuse-target]');
    const id = marker?.dataset.id || target?.getAttribute('data-ui-reuse-target');
    if (!id) return;
    event.preventDefault();
    select(id, false, true);
  }
  function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); }
  const observer = new ResizeObserver(schedule);
  for (const { target } of pairs) observer.observe(target);
  if (viewport) observer.observe(viewport);
  window.addEventListener('resize', schedule);
  root.addEventListener('load', schedule, true);
  root.addEventListener('click', handleClick);
  schedule();
  if (missing.length) {
    const warning = ownerDocument.createElement('p');
    warning.className = 'ui-reuse-missing';
    warning.textContent = `以下标注未定位到元素：${missing.join('、')}`;
    (root.nodeType === 9 ? root.body : root).prepend(warning);
  }
  const dispose = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('resize', schedule);
    root.removeEventListener('load', schedule, true);
    root.removeEventListener('click', handleClick);
    for (const { target } of pairs) {
      target.removeAttribute('data-ui-reuse-target');
      target.removeAttribute('data-ui-reuse-active');
    }
    overlay.remove();
  };
  dispose.select = (id, scroll = false) => select(id, scroll);
  dispose.filter = kind => {
    for (const { marker, annotation } of pairs) {
      const recommendation = annotation.recommendation || (annotation.kind === 'unresolved' ? 'new' : 'reuse');
      marker.classList.toggle('ui-reuse-marker-filtered', kind !== 'all' && recommendation !== kind);
    }
  };
  dispose.reposition = schedule;
  return dispose;
}
