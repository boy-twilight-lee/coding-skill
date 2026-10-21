export function mountAnnotations(root, annotations, viewport) {
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
    const marker = ownerDocument.createElement('span');
    marker.className = 'ui-reuse-marker';
    marker.textContent = `${annotation.id} · ${annotation.component}`;
    marker.title = annotation.sourcePath || annotation.packageName || '未找到匹配项';
    overlay.append(marker);
    pairs.push({ target, marker });
  }
  (root.nodeType === 9 ? root.documentElement : root).append(overlay);
  let frame;
  function position() {
    const origin = viewport?.getBoundingClientRect() || { left: 0, top: 0 };
    for (const { target, marker } of pairs) {
      const bounds = target.getBoundingClientRect();
      marker.style.left = `${Math.max(0, bounds.left - origin.left + (viewport?.scrollLeft || window.scrollX))}px`;
      marker.style.top = `${Math.max(0, bounds.top - origin.top + (viewport?.scrollTop || window.scrollY) - marker.offsetHeight - 5)}px`;
    }
  }
  function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); }
  const observer = new ResizeObserver(schedule);
  for (const { target } of pairs) observer.observe(target);
  if (viewport) observer.observe(viewport);
  window.addEventListener('resize', schedule);
  root.addEventListener('load', schedule, true);
  schedule();
  if (missing.length) {
    const warning = ownerDocument.createElement('p');
    warning.className = 'ui-reuse-missing';
    warning.textContent = `以下标注未定位到元素：${missing.join('、')}`;
    (root.nodeType === 9 ? root.body : root).prepend(warning);
  }
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('resize', schedule);
    root.removeEventListener('load', schedule, true);
    overlay.remove();
  };
}
