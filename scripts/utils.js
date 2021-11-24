/**
 * Returns the article category from a given url.
 * Example Input: http://localhost:3000/it/chi-siamo/manufacturing-technology-bo
 * Example Output: chi-siamo
 * @param url
 */
function getCategoryFromUrl(url) {
  if (url) {
    const parts = url.split('/');
    if (parts.length > 3) {
      return parts[4];
    }
  }
  return url;
}

/**
 * Returns an url with protocal, hostname and port replaced by the current environment.
 * Example Input: https://main--helix-pmi--kptdobe.hlx3.page/it/chi-siamo/manufacturing-technology-bo
 * Example Output: http://localhost:3000/it/chi-siamo/manufacturing-technology-bo
 * @param url
 * @returns {string}
 */
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

  // clean url
  return parsedUrl.href.replace('\'', '-');
}

/**
 * Parses each response at returns it as string.
 * @param responseArray
 * @returns {Promise<unknown[]>}
 */
async function fetchTextFromMarkup(responseArray) {
  const articlesMarkupText = [];
  for (let i = 0; i < responseArray.length; i += 1) {
    const resp = responseArray[i].text();
    articlesMarkupText.push(resp);
  }

  return Promise.all(articlesMarkupText);
}

/**
 * Fetches the plain markup as a response from a helix pages for the given array of helix urls.
 * @param urlArray
 * @returns {Promise<unknown[]>}
 */
async function fetchDomain(urlArray) {
  const relatedArticlesMarkup = [];

  for (let i = 0; i < urlArray.length; i += 1) {
    const url = getUrlForEnvironment(urlArray[i].firstChild.text);
    const resp = fetch(`${url}.plain.html`);
    relatedArticlesMarkup.push(resp);
  }

  return Promise.all(relatedArticlesMarkup);
}

export {
  getCategoryFromUrl,
  getUrlForEnvironment,
  fetchTextFromMarkup,
  fetchDomain,
};