/**
 * <project-video>: a muted, looping background video with a pause/play button.
 *
 * - Starts playing only when the visitor hasn't asked for reduced motion.
 * - The button lets anyone stop the motion (WCAG 2.2.2 Pause, Stop, Hide).
 * - Without JavaScript the video stays paused on its poster frame.
 */
if (!customElements.get('project-video')) {
  customElements.define(
    'project-video',
    class ProjectVideo extends HTMLElement {
      connectedCallback() {
        this.video = this.querySelector('video');
        this.button = this.querySelector('.project-video__toggle');
        if (!this.video || !this.button) return;

        this.button.hidden = false;
        this.button.addEventListener('click', () => (this.video.paused ? this.play() : this.pause()));
        this.video.addEventListener('play', () => this.update());
        this.video.addEventListener('pause', () => this.update());

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
          this.update();
        } else {
          this.play();
        }
      }

      play() {
        const attempt = this.video.play();
        if (attempt) attempt.catch(() => this.update());
      }

      pause() {
        this.video.pause();
      }

      update() {
        const paused = this.video.paused;
        this.button.setAttribute('aria-label', paused ? this.button.dataset.playLabel : this.button.dataset.pauseLabel);
        this.button.classList.toggle('is-paused', paused);
      }
    }
  );
}
