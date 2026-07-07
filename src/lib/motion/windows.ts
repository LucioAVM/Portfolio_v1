/**
 * Ventanas arrastrables estilo SO, sin dependencias.
 * - El "drag handle" es únicamente el header ([data-window-handle]).
 * - Al interactuar con una ventana, pasa al frente (z-index mayor).
 * - Drag solo en desktop (>=1024px); en móvil las ventanas quedan apiladas.
 */
export function initWindows(): void {
  const windows = Array.from(document.querySelectorAll<HTMLElement>('[data-window]'));
  if (!windows.length) return;

  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
  let zTop = 20;

  windows.forEach((win) => {
    const handle = win.querySelector<HTMLElement>('[data-window-handle]');
    let offsetX = 0;
    let offsetY = 0;
    let startX = 0;
    let startY = 0;
    let dragging = false;

    const bringToFront = () => {
      win.style.zIndex = String(++zTop);
    };

    win.addEventListener('pointerdown', bringToFront);

    if (!handle) return;

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const nextX = offsetX + (event.clientX - startX);
      const nextY = offsetY + (event.clientY - startY);
      win.style.transform = `translate(${nextX}px, ${nextY}px)`;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      offsetX += event.clientX - startX;
      offsetY += event.clientY - startY;
      handle.releasePointerCapture?.(event.pointerId);
      handle.classList.remove('is-dragging');
    };

    handle.addEventListener('pointerdown', (event: PointerEvent) => {
      if (!isDesktop() || event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      bringToFront();
      handle.setPointerCapture?.(event.pointerId);
      handle.classList.add('is-dragging');
      event.preventDefault();
    });

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
  });
}
