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

import { getMetadataJson, createOptimizedPicture } from '../../scripts/scripts.js';

const combo = {
  default: ['large', 'small', 'small2', 'medium'],
};

export default async function decorate(block, eager) {
  block.querySelectorAll('a').forEach(async (a, index) => {
    const u = new URL(a.href);
    const meta = await getMetadataJson(u.pathname);
    const title = meta['og:title'];
    const url = meta['og:url'];
    const img = meta['og:image'];
    const description = meta['og:description'];

    if (title && url && img && index < 4) {
      const div = document.createElement('div');
      div.classList.add(combo.default[index]);
      const link = document.createElement('a');
      link.href = url;

      const picture = createOptimizedPicture(img, eager);
      link.append(picture);

      const h2 = document.createElement('h2');
      [h2.innerHTML] = title.split('|');
      link.append(h2);

      if (description) {
        const p = document.createElement('p');
        p.innerHTML = description;
        link.append(p);
      }

      div.append(link);

      a.parentNode.replaceWith(div);
    } else {
      // a.parentNode.remove();
    }
  });
}
