import createTag from '../gnav/gnav-utils.js';

class SocialWrapper {
  constructor(el) {
    this.el = el;
    this.desktop = window.matchMedia('(min-width: 900px)');
  }

  init = async () => {
    console.log('ping');

    //  Facebook
    const facebookButton = createTag('button', { class: 'social-wrapper_button' });
    facebookButton.innerText = 'Facebook';
    this.el.appendChild(facebookButton);

    //  Twitter
    const twitterButton = createTag('button', { class: 'social-wrapper_button' });
    twitterButton.innerText = 'Twitter';
    this.el.appendChild(twitterButton);

    //  LinkedIn
    const linkedInButton = createTag('button', { class: 'social-wrapper_button' });
    linkedInButton.innerText = 'LinkedIn';
    this.el.appendChild(linkedInButton);

    //  E-Mail
    const mailButton = createTag('button', { class: 'social-wrapper_button' });
    mailButton.innerText = 'E-Mail';
    this.el.appendChild(mailButton);
  };
}

export default async function init(block) {
  try {
    const socialWrapper = new SocialWrapper(block);
    await socialWrapper.init();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Could not create socials-wrapper.', error.message);
  }
}
