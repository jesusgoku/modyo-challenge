/**
 * Make a collection to html markup transform
 *
 * @param {string} tmpl - template string
 *
 * @returns {Function} - Collection to markup transform
 */
function makeCollectionToMarkupFromTmpl(tmpl) {
  return (collection) =>
    collection
      .map((item) =>
        Object.entries(item).reduce(
          (acc, [key, value]) => acc.replace(new RegExp(`__REPLACE_BY_${key}__`, 'g'), value),
          tmpl,
        ),
      )
      .join('');
}

/**
 * Wrap fetch for support timeout
 *
 * @param {string} url - url for request
 * @param {object} options - fetch API options
 * @param {number} options.timeout - milliseconds to abort request
 *
 * @return {Promise<Response>} - fetch response object
 * @throws {Promise<Error>} - fetch error
 */
function fetchWithTimeout(url, { timeout = 5000, ...options } = {}) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => {
      controller.abort();
      reject(new Error('Error: Timeout'));
    }, timeout);

    fetch(url, { signal, ...options })
      .then(resolve)
      .catch(reject);
  });
}

export { makeCollectionToMarkupFromTmpl, fetchWithTimeout };
