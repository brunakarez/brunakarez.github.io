const windows = [...document.querySelectorAll('.window')];
const menu = document.querySelector('.desktop-menu');
const menuToggle = document.querySelector('.menu-toggle');
const taskbar = document.querySelector('.taskbar');
let highestZ = 10;

function openWindow(name) {
  const panel = document.querySelector(`[data-window="${name}"]`);
  if (!panel) return;
  panel.hidden = false;
  panel.style.zIndex = ++highestZ;
  const taskButton = taskbar.querySelector(`[data-open="${name}"]`);
  if (taskButton) taskButton.hidden = false;
  menu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function closeWindow(panel) {
  panel.hidden = true;
  const taskButton = taskbar.querySelector(`[data-open="${panel.dataset.window}"]`);
  if (taskButton) taskButton.hidden = true;
}

document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => openWindow(button.dataset.open));
});
document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => closeWindow(button.closest('.window')));
});
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menu.classList.toggle('is-open', !expanded);
});

windows.forEach(panel => {
  panel.addEventListener('pointerdown', () => { panel.style.zIndex = ++highestZ; });
  const handle = panel.querySelector('[data-drag-handle]');
  let drag = null;
  handle.addEventListener('pointerdown', event => {
    if (event.target.closest('button') || matchMedia('(max-width: 700px)').matches) return;
    const rect = panel.getBoundingClientRect();
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;
    panel.style.transform = 'none';
    drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener('pointermove', event => {
    if (!drag) return;
    const maxLeft = window.innerWidth - panel.offsetWidth;
    const maxTop = window.innerHeight - 70;
    panel.style.left = `${Math.max(0, Math.min(maxLeft, event.clientX - drag.x))}px`;
    panel.style.top = `${Math.max(0, Math.min(maxTop, event.clientY - drag.y))}px`;
  });
  const stopDrag = () => { drag = null; };
  handle.addEventListener('pointerup', stopDrag);
  handle.addEventListener('pointercancel', stopDrag);
});

const clock = document.querySelector('#clock');
function updateClock() {
  clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
}
updateClock();
setInterval(updateClock, 1000);
