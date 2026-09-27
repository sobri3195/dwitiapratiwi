import './style.css';
import { createBirthdayScene } from './scene.js';
import { createMusicPlayer } from './music.js';
import { launchConfetti } from './confetti.js';

const scene = createBirthdayScene(document.querySelector('#birthday-scene'));
const music = createMusicPlayer();
const musicButton = document.querySelector('#music-toggle');
const musicLabel = document.querySelector('#music-label');
const modal = document.querySelector('#surprise-modal');
const closeButton = document.querySelector('#modal-close');
let previousFocus;

musicButton.addEventListener('click', async () => {
  const playing = await music.toggle();
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.classList.toggle('is-playing', playing);
  musicLabel.textContent = playing ? 'Matikan musik' : 'Nyalakan musik';
});

function openSurprise() {
  previousFocus = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('is-open'));
  closeButton.focus();
  launchConfetti(document.querySelector('#confetti-canvas'));
}

function closeSurprise() {
  modal.classList.remove('is-open');
  setTimeout(() => { modal.hidden = true; }, 350);
  previousFocus?.focus();
}

document.querySelectorAll('[id^="surprise-button"]').forEach((button) => button.addEventListener('click', openSurprise));
closeButton.addEventListener('click', closeSurprise);
modal.querySelector('.modal-backdrop').addEventListener('click', closeSurprise);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeSurprise(); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

window.addEventListener('pagehide', () => {
  scene.destroy();
  music.destroy();
  observer.disconnect();
}, { once: true });
