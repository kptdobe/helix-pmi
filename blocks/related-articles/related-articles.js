import createTag from '../gnav/gnav-utils.js';

const ADCHOICE_IMG = '<img class="footer-link-img" loading="lazy" alt="AdChoices icon" src="/blocks/footer/adchoices-small.svg">';

class RelatedArticles {
  constructor(parsedArticles, el) {
    this.el = el;
    this.parsedArticles = parsedArticles;
    this.desktop = window.matchMedia('(min-width: 900px)');
  }

  init = async () => {
    const wrapper = createTag('div', { class: 'related-articles_wrapper' });

    for (let i = 0; i < this.parsedArticles.length; i += 1) {
      // todo loop over parsed Articles and create a "related-articles_item" for each.
      console.log('parsedArticles[i]', this.parsedArticles[i]);
    }

    this.el.append(wrapper);
  };
}

async function fetchMarkupTextFromArticles(relatedArticlesMarkup) {
  const articlesMarkupText = [];
  for (let i = 0; i < relatedArticlesMarkup.length; i += 1) {
    const resp = relatedArticlesMarkup[i].text();
    articlesMarkupText.push(resp);
  }

  return Promise.all(articlesMarkupText);
}

async function fetchArticles(relatedArticleUrls) {
  const relatedArticlesMarkup = [];

  for (let i = 0; i < relatedArticleUrls.length; i += 1) {
    const resp = fetch(`${relatedArticleUrls[i].firstChild.text}.plain.html`);
    relatedArticlesMarkup.push(resp);
  }

  return Promise.all(relatedArticlesMarkup);
}

export default async function init(block) {
  const relatedArticleUrls = block.firstChild.firstChild.querySelectorAll('p');

  if (relatedArticleUrls && relatedArticleUrls.length > 0) {
    const relatedArticlesMarkup = await fetchArticles(relatedArticleUrls);
    const articlesMarkupText = await fetchMarkupTextFromArticles(relatedArticlesMarkup);
    console.log('relatedArticlesMarkup', relatedArticlesMarkup);
    console.log('articlesMarkupText', articlesMarkupText);

    if (articlesMarkupText) {
      try {
        const parser = new DOMParser();
        const parsedArticles = [];

        for (let i = 0; i < articlesMarkupText.length; i += 1) {
          console.log('articlesMarkupText[i]', articlesMarkupText[i]);
          parsedArticles.push(parser.parseFromString(articlesMarkupText[i], 'text/html'));
        }

        const relatedArticles = new RelatedArticles(parsedArticles, block);
        await relatedArticles.init();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Could not create related-articles.', error.message);
      }
    }
  }
}
