import { makeLinkRelative } from '../../scripts/scripts.js';

import createTag, {
  fetchDomain,
  fetchTextFromMarkup,
  getCategoryFromUrl,
} from '../../scripts/utils.js';

class RelatedArticles {
  constructor(articleContainers, el) {
    this.el = el;
    this.articleContainers = articleContainers;
    this.desktop = window.matchMedia('(min-width: 900px)');
  }

  init = async () => {
    if (this.articleContainers && this.articleContainers.length > 0) {
      const container = createTag('div', { class: 'related-articles' });
      const wrapper = createTag('div', { class: 'related-articles_wrapper' });
      const relatedArticlesHeader = createTag('h2', { class: 'related-articles_header' });
      relatedArticlesHeader.innerHTML = getCategoryFromUrl(this.articleContainers[0].url);
      // todo display category up top

      for (let i = 0; i < this.articleContainers.length; i += 1) {
        // todo loop over parsed Articles and create a "related-articles_item" for each.
        const item = createTag('div', { class: 'related-articles_item' });
        const title = createTag('div', { class: 'related-articles_item-title' });
        const parsedArticle = this.articleContainers[i].text;
        const titleText = parsedArticle.querySelector('html body div h1').innerHTML;
        title.innerHTML = titleText;
        // const subtitle = parsedArticle.querySelector('html body div p');
        const imageWrapper = parsedArticle.querySelector('html body div p picture');
        const aTag = createTag('a', { class: 'related-articles_link' });
        aTag.href = this.articleContainers[i].url;
        aTag.title = titleText;
        item.append(aTag);

        aTag.append(imageWrapper);
        aTag.append(title);
        // item.append(title);
        wrapper.append(item);
      }

      // todo wrap in a tag

      // remove 'old' block of related articles links
      this.el.firstChild.remove();
      container.append(relatedArticlesHeader);
      container.append(wrapper);

      // add related articles content to original div
      this.el.append(container);
    }
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
        const articleContainers = [];

        for (let i = 0; i < articlesMarkupText.length; i += 1) {
          const transformedUrl = makeLinkRelative(relatedArticleUrls[i].querySelector('a')
            .getAttribute('href'));
          const articleContainer = {
            text: parser.parseFromString(articlesMarkupText[i], 'text/html'),
            url: transformedUrl,
          };
          articleContainers.push(articleContainer);
        }

        const relatedArticles = new RelatedArticles(articleContainers, block);
        await relatedArticles.init();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Could not create related-articles.', error.message);
      }
    }
  }
}
