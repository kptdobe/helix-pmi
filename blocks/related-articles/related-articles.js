import createTag from '../gnav/gnav-utils.js';

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

    // todo append teaser tiles to this.el.parent -> <div class="related-articles"/>
    // remove rest
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

  function getUrlForEnvironment(url) {
    const parsedUrl = new URL(url);
    const {
      protocol,
      hostname,
      port,
    } = document.location;

    parsedUrl.hostname = hostname;
    parsedUrl.protocol = protocol;
    parsedUrl.port = port;

    return parsedUrl.href;
  }

  for (let i = 0; i < relatedArticleUrls.length; i += 1) {
    const url = getUrlForEnvironment(relatedArticleUrls[i].firstChild.text);
    const resp = fetch(`${url}.plain.html`);
    relatedArticlesMarkup.push(resp);
  }

  return Promise.all(relatedArticlesMarkup);
}

export default async function init(block) {
  const relatedArticleUrls = block.firstChild.firstChild.querySelectorAll('p');

  if (relatedArticleUrls && relatedArticleUrls.length > 0) {
    const relatedArticlesMarkup = await fetchArticles(relatedArticleUrls);
    const articlesMarkupText = await fetchMarkupTextFromArticles(relatedArticlesMarkup);

    if (articlesMarkupText) {
      try {
        const parser = new DOMParser();
        const parsedArticles = [];

        for (let i = 0; i < articlesMarkupText.length; i += 1) {
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
