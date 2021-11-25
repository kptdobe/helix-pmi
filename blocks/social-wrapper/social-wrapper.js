import createTag from '../../scripts/utils.js';

class SocialWrapper {
  constructor(el) {
    this.el = el;
    this.desktop = window.matchMedia('(min-width: 900px)');
  }

  getSocialIconElement(iconName) {
    return createTag('img', {
      class: 'footer-social-img',
      loading: 'lazy',
      src: `/blocks/footer/${iconName}-square.svg`,
      alt: `${iconName} logo`,
    });
  };

  init = async () => {

    //  Facebook
    const facebookButton = createTag('button', { class: 'social-wrapper_button' });
    facebookButton.setAttribute('data-service', 'facebook');
    facebookButton.setAttribute('data-url', 'https://www.pmi.com/markets/italy/it/chi-siamo/nostri-prodotti?utm_source=share+button+facebook&utm_medium=social&utm_campaign=share');
    facebookButton.appendChild(this.getSocialIconElement('facebook'));
    this.el.appendChild(facebookButton);

    //  Twitter
    const twitterButton = createTag('button', { class: 'social-wrapper_button' });
    twitterButton.setAttribute('data-service', 'twitter');
    twitterButton.setAttribute('data-url', 'https://www.pmi.com/markets/italy/it/chi-siamo/nostri-prodotti?utm_source=share+button+twitter&utm_medium=social&utm_campaign=share');
    twitterButton.appendChild(this.getSocialIconElement('twitter'));
    this.el.appendChild(twitterButton);

    //  LinkedIn
    const linkedInButton = createTag('button', { class: 'social-wrapper_button' });
    linkedInButton.setAttribute('data-service', 'linkedin');
    linkedInButton.setAttribute('data-url', 'https://www.pmi.com/markets/italy/it/chi-siamo/nostri-prodotti?utm_source=share+button+linkedin&utm_medium=social&utm_campaign=share');
    linkedInButton.appendChild(this.getSocialIconElement('linkedin'));
    this.el.appendChild(linkedInButton);

    //  E-Mail
    const mailButton = createTag('a', { class: 'social-wrapper_button' });
    mailButton.setAttribute('href', 'mailto:?subject=Take a look at this on PMI.com - I nostri prodotti&body=I found this on PMI.com and thought that it might interest you.%0D%0AI nostri prodotti %0D%0AI prodotti Philip Morris in Italia: da azienda leader nel commercio delle sigarette tradizionali alla trasformazione verso i prodotti senza fumo come IQOS.\t %0D%0ARead more: https://www.pmi.com/markets/italy/it/chi-siamo/nostri-prodotti%3Futm_source%3Dshare%2Bbutton%2Bemail%26utm_medium%3Demail%26utm_campaign%3Dshare');
    mailButton.innerText = '✉';
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
