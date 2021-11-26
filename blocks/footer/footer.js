import createTag from '../../scripts/utils.js';

const ADCHOICE_IMG = '<img class="footer-link-img" loading="lazy" alt="AdChoices icon" src="/blocks/footer/adchoices-small.svg">';

class Footer {
  constructor(body, el) {
    this.el = el;
    this.body = body;
    this.desktop = window.matchMedia('(min-width: 900px)');
  }

  init = async () => {
    const wrapper = createTag('div', { class: 'footer-wrapper' });

    const grid = this.decorateGrid();
    if (grid) {
      wrapper.append(grid);
    }

    const infoRow = createTag('div', { class: 'footer-info' });
    const infoColumnLeft = createTag('div', { class: 'footer-info-column' });
    const infoColumnRight = createTag('div', { class: 'footer-info-column' });


    const privacy = this.decoratePrivacy();

    if (privacy) {
      infoRow.append(privacy);
    }

    if (infoRow.hasChildNodes()) {
      wrapper.append(infoRow);
    }

    this.el.append(wrapper);
  };

  decorateGrid = () => {
    const gridBlock = this.body.querySelector('.footer-links > div');
    if (!gridBlock) return null;
    this.desktop.addEventListener('change', this.onMediaChange);
    // build grid container
    const navGrid = createTag('div', { class: 'footer-nav-grid' });
    const columns = gridBlock.querySelectorAll('div');
    return this.decorateInit(navGrid, columns);
    //return navGrid;
  };

  decorateFooterCommon = (heading) => {
    const navItem = createTag('div', { class: 'footer-nav-item' });
    const titleId = heading.textContent.trim().toLowerCase().replace(/ /g, '-');
    let expanded = false;
    if (this.desktop.matches) { expanded = true; }
    // populate grid column item
    const title = createTag('a', {
      class: 'footer-nav-item-title',
      role: 'button',
      'aria-expanded': expanded,
      'aria-controls': `${titleId}-menu`,
    });
    title.textContent = heading.textContent;
    navItem.append(title);
    return navItem
  };


  decorateInit = (navGrid, columns) => {
    var count = 0;

    columns.forEach((column) => {
      const navColumn = createTag('div', { class: 'footer-nav-column' });
      const headings = column.querySelectorAll('h2');
      headings.forEach((heading) => {
        const titleId = heading.textContent.trim().toLowerCase().replace(/ /g, '-');

        const navItem = this.decorateFooterCommon(heading);

        if (count < 3) {
          // build grid column
          const linksContainer = heading.nextElementSibling;
          linksContainer.classList = 'footer-nav-item-links';
          linksContainer.id = `${titleId}-menu`;
          if (!this.desktop.matches) {
            title.addEventListener('click', this.toggleMenu);
          }
          const links = linksContainer.querySelectorAll('li');
          links.forEach((link) => {
            link.classList.add('footer-nav-item-link');
          });
          navItem.append(linksContainer);
          navColumn.append(navItem);
        }
        else {
          const social = this.decorateSocialIcons(heading);
          navItem.append(social);
          navColumn.append(navItem);

        }
      });
      navGrid.append(navColumn);
      count += 1;
    });

    return navGrid;
  };


  decorateSocialIcons = (heading) => {
    // build social icon wrapper
    const socialWrapper = createTag('div', { class: 'footer-social' });
    // build social icon links
    const socialLinks = createTag('ul', { class: 'footer-social-icons' });
    const linksContainer = heading.nextElementSibling;
    linksContainer.querySelectorAll('a').forEach((a) => {
      const domain = a.host.replace(/www./, '').replace(/.com/, '');
      const supported = ['facebook', 'twitter', 'instagram', 'linkedin'];
      if (supported.includes(domain)) {
        // populate social icon links
        const li = createTag('li', { class: 'footer-social-icon' });
        const socialIcon = createTag('img', {
          class: 'footer-social-img',
          loading: 'lazy',
          src: `/blocks/footer/${domain}-square.svg`,
          alt: `${domain} logo`,
        });
        a.setAttribute('aria-label', domain);
        a.textContent = '';
        a.append(socialIcon);
        li.append(a);
        socialLinks.append(li);
      } else { a.remove(); }
      socialWrapper.append(socialLinks);
    });
    return socialWrapper;
  };

  decoratePrivacy = () => {
    const copyrightEl = this.body.querySelector('div em');
    const links = copyrightEl.parentElement.querySelectorAll('a');
    if (!copyrightEl || !links) return null;
    const infoLinks = createTag('ul', { class: 'footer-info' });
    // populate privacy links
    links.forEach((link) => {
      const li = createTag('li', { class: 'footer-privacy-link' });
      if (link.hash === '#interest-based-ads') {
        link.insertAdjacentHTML('afterbegin', ADCHOICE_IMG);
      }
      li.append(link);
      infoLinks.append(li);
    });
    return infoLinks;
  };

  toggleMenu = (e) => {
    const button = e.target.closest('[role=button]');
    const expanded = button.getAttribute('aria-expanded');
    if (expanded === 'true') {
      this.closeMenu(button);
    } else {
      this.openMenu(button);
    }
  };

  closeMenu = (el) => {
    if (el.id === 'region-button') {
      window.removeEventListener('keydown', this.closeOnEscape);
      window.removeEventListener('click', this.closeOnDocClick);
    }
    el.setAttribute('aria-expanded', false);
  };

  openMenu = (el) => {
    const type = el.classList[0];
    const expandedMenu = document.querySelector(`.${type}[aria-expanded=true]`);
    if (expandedMenu) { this.closeMenu(expandedMenu); }
    if (el.id === 'region-button') {
      window.addEventListener('keydown', this.closeOnEscape);
      window.addEventListener('click', this.closeOnDocClick);
    }
    el.setAttribute('aria-expanded', true);
  };

  closeOnEscape = (e) => {
    const button = document.getElementById('region-button');
    if (e.code === 'Escape') {
      this.closeMenu(button);
    }
  };

  closeOnDocClick = (e) => {
    const button = document.getElementById('region-button');
    const a = e.target.closest('a');
    if (a !== button) {
      this.closeMenu(button);
    }
  };

  onMediaChange = (e) => {
    if (e.matches) {
      document.querySelectorAll('.footer-nav-item-title').forEach((button) => {
        button.setAttribute('aria-expanded', true);
        button.removeEventListener('click', this.toggleMenu);
      });
    } else {
      document.querySelectorAll('.footer-nav-item-title').forEach((button) => {
        button.setAttribute('aria-expanded', false);
        button.addEventListener('click', this.toggleMenu);
      });
    }
  };
}

async function fetchFooter(url) {
  const resp = await fetch(`${url}.plain.html`);
  const html = await resp.text();
  return html;
}

export default async function init(block) {
  const url = block.getAttribute('data-footer-source');
  if (url) {
    const html = await fetchFooter(url);
    if (html) {
      try {
        const parser = new DOMParser();
        const footerDoc = parser.parseFromString(html, 'text/html');
        const footer = new Footer(footerDoc.body, block);
        footer.init();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Could not create footer.', error.message);
      }
    }
  }
}
