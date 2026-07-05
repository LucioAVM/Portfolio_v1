/** Reloj en vivo para la barra de estado (hora local del visitante). */
export function initClock(): void {
  const nodes = document.querySelectorAll<HTMLTimeElement>('[data-clock]');
  if (!nodes.length) return;

  const format = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const update = (): void => {
    const now = new Date();
    const value = format.format(now);
    nodes.forEach((node) => {
      node.textContent = value;
      node.dateTime = now.toISOString();
    });
  };

  update();
  window.setInterval(update, 15_000);
}
