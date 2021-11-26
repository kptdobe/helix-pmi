import createTag from '../../scripts/utils.js';

class Video {
  constructor(el) {
    this.el = el;
    this.desktop = window.matchMedia('(min-width: 900px)');
    this.href = el.querySelector('div > a')
      .getAttribute('href');
  }

  // eslint-disable-next-line class-methods-use-this
  createEmbedUrl = (src) => src.replace('watch?v=', 'embed/');

  // eslint-disable-next-line class-methods-use-this
  createIframe = (src) => createTag('iframe', {
    width: '500',
    height: '350',
    src: this.createEmbedUrl(src),
    title: 'YouTube video player',
    frameBorder: '0',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullScreen: true,
  });

  init = async () => {
    const iframe = this.createIframe(this.href);
    this.el.removeChild(this.el.firstChild);
    this.el.appendChild(iframe);
  };
}

export default async function init(block) {
  try {
    const video = new Video(block);
    await video.init();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Could not create video.', error.message);
  }
}
