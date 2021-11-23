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

const combo = {
  default: ['large', 'small', 'small2', 'medium'],
};

export default async function decorate(block) {
  const container = block.firstElementChild;
  block.querySelectorAll(':scope > div > div').forEach((div, index) => {
    if (index < 4) {
      div.classList.add(combo.default[index]);

      const link = div.querySelector('a');
      link.innerHTML = '';
      link.parentNode.replaceWith(link);

      const picture = div.querySelector('picture');
      if (picture) {
        picture.parentNode.replaceWith(picture);
        link.append(picture);
      }

      const text = document.createElement('div');
      text.classList.add('text');

      const h = div.querySelector('h2');
      if (h) {
        text.append(h);
      }

      const ps = div.querySelectorAll('p');
      ps.forEach((p) => {
        text.append(p);
      });

      link.append(text);

      const parent = div.parentNode;
      container.append(div);
      if (!parent.hasChildNodes()) {
        parent.remove();
      }
    } else {
      div.remove();
    }
  });
}
