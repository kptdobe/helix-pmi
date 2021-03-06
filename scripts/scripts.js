/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

if (window.location.pathname === '/') {
  window.location.pathname = '/it/';
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
export function loadCSS(href) {
  if (!document.querySelector(`head > link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    link.onload = () => {
    };
    link.onerror = () => {
    };
    document.head.appendChild(link);
  }
}

/**
 * Retrieves the content of a metadata tag.
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value
 */
export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const $meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return $meta && $meta.content;
}

/**
 * forward looking *.metadata.json experiment
 * fetches metadata.json of page
 * @param {path} path to *.metadata.json
 * @returns {Object} containing sanitized meta data
 */
export async function getMetadataJson(path) {
  const resp = await fetch(path.split('.')[0]);
  const text = await resp.text();
  const meta = {};
  if (resp.status === 200 && text && text.includes('<head>')) {
    const headStr = text.split('<head>')[1].split('</head>')[0];
    const head = document.createElement('head');
    head.innerHTML = headStr;
    const metaTags = head.querySelectorAll(':scope > meta');
    metaTags.forEach((metaTag) => {
      const name = metaTag.getAttribute('name') || metaTag.getAttribute('property');
      const value = metaTag.getAttribute('content');
      if (meta[name]) {
        meta[name] += `, ${value}`;
      } else {
        meta[name] = value;
      }
    });
  }
  return meta;
}

/**
 * Adds one or more URLs to the dependencies for publishing.
 * @param {string|[string]} url The URL(s) to add as dependencies
 */
export function addPublishDependencies(url) {
  const urls = Array.isArray(url) ? url : [url];
  window.hlx = window.hlx || {};
  if (window.hlx.dependencies && Array.isArray(window.hlx.dependencies)) {
    window.hlx.dependencies.concat(urls);
  } else {
    window.hlx.dependencies = urls;
  }
}

/**
 * Sanitizes a name for use as class name.
 * @param {*} name The unsanitized name
 * @returns {string} The class name
 */
export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase()
      .replace(/[^0-9a-z]/gi, '-')
    : '';
}

/**
 * Wraps each section in an additional {@code div}.
 * @param {[Element]} $sections The sections
 */
function wrapSections($sections) {
  $sections.forEach(($div) => {
    if ($div.childNodes.length === 0) {
      // remove empty sections
      $div.remove();
    } else if (!$div.id) {
      const $wrapper = document.createElement('div');
      $wrapper.className = 'section-wrapper';
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
    }
  });
}

export function makeLinkRelative(href) {
  if (!href.startsWith('/')) {
    const url = new URL(href);
    const host = url.hostname;
    if (host.endsWith('.page') || host.endsWith('.live')) return (`${url.pathname}${url.search}${url.hash}`);
  }
  return href;
}

export function getLocale() {
  return window.location.href.includes('/en/') ? 'en' : 'it';
}

export function getPlaceholder(key) {
  const PLACEHOLDERS = {
    en: {
      more: 'Lear more',
    },
    it: {
      more: 'Scopri di pi??',
    },
  };

  return PLACEHOLDERS[getLocale()][key];
}

/**
 * Build figcaption element
 * @param {Element} pEl The original element to be placed in figcaption.
 * @returns figCaptionEl Generated figcaption
 */
export function buildCaption(pEl) {
  const figCaptionEl = document.createElement('figcaption');
  pEl.classList.add('caption');
  figCaptionEl.append(pEl);
  return figCaptionEl;
}

/**
 * Build figure element
 * @param {Element} blockEl The original element to be placed in figure.
 * @returns figEl Generated figure
 */
export function buildFigure(blockEl) {
  const figEl = document.createElement('figure');
  figEl.classList.add('figure');
  // content is picture only, no caption or link
  if (blockEl.firstChild) {
    if (blockEl.firstChild.nodeName === 'PICTURE' || blockEl.firstChild.nodeName === 'VIDEO') {
      figEl.append(blockEl.firstChild);
    } else if (blockEl.firstChild.nodeName === 'P') {
      const pEls = Array.from(blockEl.children);
      pEls.forEach((pEl) => {
        if (pEl.firstChild) {
          if (pEl.firstChild.nodeName === 'PICTURE' || pEl.firstChild.nodeName === 'VIDEO') {
            figEl.append(pEl.firstChild);
          } else if (pEl.firstChild.nodeName === 'EM') {
            const figCapEl = buildCaption(pEl);
            figEl.append(figCapEl);
          } else if (pEl.firstChild.nodeName === 'A') {
            const picEl = figEl.querySelector('picture');
            if (picEl) {
              pEl.firstChild.textContent = '';
              pEl.firstChild.append(picEl);
            }
            figEl.prepend(pEl.firstChild);
          }
        }
      });
    // catch link-only figures (like embed blocks);
    } else if (blockEl.firstChild.nodeName === 'A') {
      figEl.append(blockEl.firstChild);
    }
  }
  return figEl;
}

/**
 * Decorates a block.
 * @param {Element} block The block element
 */
export function decorateBlock(block) {
  const classes = Array.from(block.classList.values());
  let blockName = classes[0];
  if (!blockName) return;
  const section = block.closest('.section-wrapper');
  if (section) {
    section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
  }
  const blocksWithVariants = ['highlights'];
  blocksWithVariants.forEach((b) => {
    if (blockName.startsWith(`${b}-`)) {
      const options = blockName.substring(b.length + 1)
        .split('-')
        .filter((opt) => !!opt);
      blockName = b;
      block.classList.add(b);
      block.classList.add(...options);
    }
  });

  block.classList.add('block');
  block.setAttribute('data-block-name', blockName);
}

/**
 * Decorates all blocks in a container element.
 * @param {Element} $main The container element
 */
function decorateBlocks($main) {
  $main
    .querySelectorAll('div.section-wrapper > div > div')
    .forEach(($block) => decorateBlock($block));
}

/**
 * Builds a block DOM Element from a two dimensional array
 * @param {string} blockName name of the block
 * @param {any} content two dimensional array or string or object of content
 */
function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement('div');
  // build image block nested div structure
  blockEl.classList.add(blockName);
  table.forEach((row) => {
    const rowEl = document.createElement('div');
    row.forEach((col) => {
      const colEl = document.createElement('div');
      const vals = col.elems ? col.elems : [col];
      vals.forEach((val) => {
        if (val) {
          if (typeof val === 'string') {
            colEl.innerHTML += val;
          } else {
            colEl.appendChild(val);
          }
        }
      });
      rowEl.appendChild(colEl);
    });
    blockEl.appendChild(rowEl);
  });
  return (blockEl);
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} $block The block element
 */
export async function loadBlock($block) {
  const blockName = $block.getAttribute('data-block-name');
  try {
    const mod = await import(`/blocks/${blockName}/${blockName}.js`);
    if (mod.default) {
      await mod.default($block, blockName, document);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load module for ${blockName}`, err);
  }

  loadCSS(`/blocks/${blockName}/${blockName}.css`);
}

/**
 * Loads JS and CSS for all blocks in a container element.
 * @param {Element} $main The container element
 */
async function loadBlocks($main) {
  $main
    .querySelectorAll('div.section-wrapper > div > .block')
    .forEach(async ($block) => loadBlock($block));
}

/**
 * Extracts the config from a block.
 * @param {Element} $block The block element
 * @returns {object} The block config
 */
export function readBlockConfig($block) {
  const config = {};
  $block.querySelectorAll(':scope>div')
    .forEach(($row) => {
      if ($row.children) {
        const $cols = [...$row.children];
        if ($cols[1]) {
          const $value = $cols[1];
          const name = toClassName($cols[0].textContent);
          let value = '';
          if ($value.querySelector('a')) {
            const $as = [...$value.querySelectorAll('a')];
            if ($as.length === 1) {
              value = $as[0].href;
            } else {
              value = $as.map(($a) => $a.href);
            }
          } else if ($value.querySelector('p')) {
            const $ps = [...$value.querySelectorAll('p')];
            if ($ps.length === 1) {
              value = $ps[0].textContent;
            } else {
              value = $ps.map(($p) => $p.textContent);
            }
          } else {
            value = $row.children[1].textContent;
          }
          config[name] = value;
        }
      }
    });
  return config;
}

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {boolean} eager load image eager
 * @param {Array} breakpoints breakpoints and corresponding params (eg. width)
 */
export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{
  media: '(min-width: 400px)',
  width: '2000',
}, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
    }
  });

  return picture;
}

/**
 * Removes formatting from images.
 * @param {Element} main The container element
 */
function removeStylingFromImages(main) {
  // remove styling from images, if any
  const imgs = [...main.querySelectorAll('strong picture'), ...main.querySelectorAll('em picture')];
  imgs.forEach((img) => {
    const parentEl = img.closest('p');
    parentEl.prepend(img);
    parentEl.lastChild.remove();
  });
}

/**
 * Normalizes all headings within a container element.
 * @param {Element} $elem The container element
 * @param {[string]]} allowedHeadings The list of allowed headings (h1 ... h6)
 */
export function normalizeHeadings($elem, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  $elem.querySelectorAll('h1, h2, h3, h4, h5, h6')
    .forEach((tag) => {
      const h = tag.tagName.toLowerCase();
      if (allowed.indexOf(h) === -1) {
        // current heading is not in the allowed list -> try first to "promote" the heading
        let level = parseInt(h.charAt(1), 10) - 1;
        while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
          level -= 1;
        }
        if (level === 0) {
          // did not find a match -> try to "downgrade" the heading
          while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
            level += 1;
          }
        }
        if (level !== 7) {
          tag.outerHTML = `<h${level}>${tag.textContent}</h${level}>`;
        }
      }
    });
}

/**
 * Decorates the picture elements.
 * @param {Element} main The container element
 */
function decoratePictures(main) {
  main.querySelectorAll('img[src*="/media_"]')
    .forEach((img, i) => {
      const newPicture = createOptimizedPicture(img.src, img.alt, !i);
      const picture = img.closest('picture');
      if (picture) picture.parentElement.replaceChild(newPicture, picture);
    });
}

/**
 * returns an image caption of a picture elements
 * @param {Element} picture picture element
 */
function getImageCaption(picture) {
  const parentEl = picture.parentNode;
  const parentSiblingEl = parentEl.nextElementSibling;
  return (parentSiblingEl && parentSiblingEl.firstChild.nodeName === 'EM' ? parentSiblingEl : undefined);
}

/**
 * builds images blocks from default content.
 * @param {Element} main The container element
 */
function buildImageBlocks(main) {
  // select all non-featured, default (non-images block) images
  const imgs = [...main.querySelectorAll(':scope > div > p > picture')];
  imgs.forEach((img) => {
    const parent = img.parentNode;
    const imagesBlock = buildBlock('images', {
      elems: [parent.cloneNode(true), getImageCaption(img)],
    });
    parent.parentNode.insertBefore(imagesBlock, parent);
    parent.remove();
  });
}

export function isArticlePage() {
  return !!document.querySelector('[name="category"]');
}

export function isBlogEntryPage() {
  return !!document.querySelector('[name="publication-date"]');
}

export function isCategoryPage() {
  return !!document.querySelector('.article-intro');
}

function buildHeroTeaserElement(title, subTitle, image) {
  const hero = document.createElement('div');
  hero.classList.add('hero');

  const heroText = document.createElement('div');
  heroText.classList.add('hero-text');

  // hero -> 2 columns (title, subline | image)
  hero.appendChild(heroText);
  heroText.appendChild(title);
  heroText.appendChild(subTitle);

  const heroImgWrapper = document.createElement('div');
  heroImgWrapper.classList.add('hero-image');
  const parent = image.parentNode;
  heroImgWrapper.append(image);
  hero.append(heroImgWrapper);
  parent.remove();

  const contentWrapper = document.querySelector('main div:first-of-type');
  // insert new hero block as first element in '<main><section-wrapper><div>'
  contentWrapper.insertBefore(hero, contentWrapper.firstChild);
}

/**
 * builds hero blocks from default content on article pages.
 */
function buildHeroBlock() {
  // first element must be a h1 and there should be a picture
  if (isArticlePage() || isCategoryPage()) {
    const title = document.querySelector('main div:first-of-type h1:first-of-type');
    const picture = document.querySelector('main div:first-of-type p picture');

    if (title && picture) {
      // grab h1, p and first img
      const subTitle = title.nextElementSibling;
      buildHeroTeaserElement(title, subTitle, picture);
    }
  }
}

function buildBlogBlock() {
  if (isBlogEntryPage()) {
    // Hero
    const title = document.querySelector('main div:first-of-type h1:first-of-type');
    const date = document.querySelector('main div:first-of-type p');
    const heroImage = document.querySelector('main div:first-of-type p picture');
    const contentWrapper = document.querySelector('main div:first-of-type');

    buildHeroTeaserElement(title, date, heroImage);

    // Blog Link
    const blog = document.getElementById('blog');
    const pTags = contentWrapper.querySelectorAll('p');
    const blogText = pTags[pTags.length - 1];

    if (blog && blogText) {
      const blogATag = blog.querySelector('a');
      const blogTextATag = blogText.querySelector('a');
      blogATag.setAttribute('href', makeLinkRelative(blogATag.getAttribute('href')));
      blogTextATag.setAttribute('href', makeLinkRelative(blogATag.getAttribute('href')));

      const tag = document.createElement('div');
      tag.classList.add('blog-link');
      tag.classList.add('block');
      tag.setAttribute('data-block-name', 'blog-link');

      contentWrapper.appendChild(tag);
      tag.appendChild(blog);
      tag.appendChild(blogText);
    }
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  removeStylingFromImages(main);
  try {
    buildHeroBlock();
    buildImageBlocks(main);
    buildBlogBlock();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Removes the empty sections from the container element.
 * @param {Element} main The container element
 */
function removeEmptySections(main) {
  main.querySelectorAll(':scope > div:empty')
    .forEach((div) => {
      div.remove();
    });
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

export function addLang() {
  document.documentElement.setAttribute('lang', getLocale());
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  // forward compatible pictures redecoration
  decoratePictures(main);
  buildAutoBlocks(main);
  removeEmptySections(main);
  wrapSections(main.querySelectorAll(':scope > div'));
  decorateBlocks(main);
}

const LCP_BLOCKS = ['highlights', 'hero']; // add your LCP blocks to the list

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);

    const block = doc.querySelector('.block');
    const hasLCPBlock = (block && LCP_BLOCKS.includes(block.getAttribute('data-block-name')));
    if (hasLCPBlock) await loadBlock(block, true);
    const lcpCandidate = doc.querySelector('main img');
    const loaded = {
      then: (resolve) => {
        if (lcpCandidate && !lcpCandidate.complete) {
          lcpCandidate.addEventListener('load', () => resolve());
          lcpCandidate.addEventListener('error', () => resolve());
        } else {
          resolve();
        }
      },
    };
    await loaded;
  }
  doc.querySelector('body')
    .classList
    .add('appear');
}

/**
 * add social icons to article pages
 * @param main
 */
function createSocialBlock(main) {
  if (isArticlePage() || isBlogEntryPage()) {
    const contentWrapper = main.querySelector('div div');
    const tag = document.createElement('div');
    tag.classList.add('social-wrapper');
    tag.classList.add('block');
    tag.setAttribute('data-block-name', 'social-wrapper');

    contentWrapper.insertBefore(tag, contentWrapper.getElementsByClassName('related-articles')[0]);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');

  /* load gnav */
  const header = document.querySelector('header');
  header.setAttribute('data-block-name', 'gnav');
  header.setAttribute('data-gnav-source', `/${getLocale()}/gnav`);
  loadBlock(header);

  /* load footer */
  const footer = document.querySelector('footer');
  footer.setAttribute('data-block-name', 'footer');
  footer.setAttribute('data-footer-source', `/${getLocale()}/footer`);
  loadBlock(footer);

  /* add custom blocks to dom */
  createSocialBlock(main);

  loadBlocks(main);
  loadCSS('/styles/lazy-styles.css');
  addLang();
  addFavIcon('/favicon.ico');
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // load anything that can be postponed to the latest here
}

/**
 * Decorates the page.
 */
async function decoratePage(doc) {
  await loadEager(doc);
  loadLazy(doc);
  loadDelayed(doc);
}

decoratePage(document);
