import { makeLinkRelative, getPlaceholder } from '../../scripts/scripts.js';

export default async function decorate(block) {
  block.querySelectorAll('a').forEach(async (a) => {
    a.href = makeLinkRelative(a.href);
    const res = await fetch(a.href);
    if (res.ok) {
      const text = await res.text();
      const mainStr = text.split('<main>')[1].split('</main>')[0];
      const remote = document.createElement('div');
      remote.innerHTML = mainStr;

      const intro = document.createElement('div');
      intro.classList.add('intro');
      a.parentNode.replaceWith(intro);

      a.innerHTML = '';
      intro.append(a);

      const picture = remote.querySelector('picture');
      const next = picture.parentNode.nextElementSibling;
      next.innerHTML = `${next.innerHTML.substring(0, 300)}...`;
      a.append(picture);

      const content = document.createElement('text');
      content.classList.add('text');
      const h1 = remote.querySelector('h1');
      const h3 = document.createElement('h3');
      h3.innerHTML = h1.innerHTML;
      content.append(h3);
      content.append(next);

      const more = document.createElement('a');
      more.classList.add('more');
      more.innerHTML = getPlaceholder('more');
      more.href = a.href;
      content.append(more);

      intro.append(content);
    }
  });
}
