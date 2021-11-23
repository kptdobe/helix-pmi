import createTag from '../gnav/gnav-utils.js';
import { fetchDomain, fetchTextFromMarkup } from '../../scripts/utils.js';

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
      const item = createTag('div', { class: 'related-articles_item' });
      const parsedArticle = this.parsedArticles[i];
      console.log('parsedArticle', parsedArticle);
      wrapper.append(item);
    }

    // remove 'old' block of related articles links
    this.el.firstChild.remove();
    // add wrapper to original div
    this.el.append(wrapper);
  };
}

export default async function init(block) {
  const relatedArticleUrls = block.firstChild.firstChild.querySelectorAll('p');

  if (relatedArticleUrls && relatedArticleUrls.length > 0) {
    const relatedArticlesMarkup = await fetchDomain(relatedArticleUrls);
    const articlesMarkupText = await fetchTextFromMarkup(relatedArticlesMarkup);

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
