// Backport from:
// - https://github.com/webpack/loader-utils/blob/v1.0.0-branch/lib/getOptions.js
// - https://github.com/webpack/loader-utils/blob/v1.0.0-branch/lib/parseQuery.js
const JSON5 = require('json5');

const specialValues = {
  null: null,
  true: true,
  false: false
};

function parseQuery(query) {
  if (query.substr(0, 1) !== '?') {
    throw new TypeError(
      "A valid query string passed to parseQuery should begin with '?'"
    );
  }

  query = query.substr(1);

  if (!query) {
    return {};
  }

  if (query.substr(0, 1) === '{' && query.substr(-1) === '}') {
    return JSON5.parse(query);
  }

  const queryArgs = query.split(/[,&]/g);
  const result = Object.create(null);

  queryArgs.forEach(arg => {
    const idx = arg.indexOf('=');

    if (idx >= 0) {
      let name = arg.substr(0, idx);
      let value = decodeURIComponent(arg.substr(idx + 1));

      if (Object.prototype.hasOwnProperty.call(specialValues, value)) {
        value = specialValues[value];
      }

      if (name.substr(-2) === '[]') {
        name = decodeURIComponent(name.substr(0, name.length - 2));

        if (!Array.isArray(result[name])) {
          result[name] = [];
        }

        result[name].push(value);
      } else {
        name = decodeURIComponent(name);
        result[name] = value;
      }
    } else if (arg.substr(0, 1) === '-') {
      result[decodeURIComponent(arg.substr(1))] = false;
    } else if (arg.substr(0, 1) === '+') {
      result[decodeURIComponent(arg.substr(1))] = true;
    } else {
      result[decodeURIComponent(arg)] = true;
    }
  });

  return result;
}

/**
 * @param {import('webpack').LoaderContext<unknown>} loaderContext
 * @returns {Record<string, unknown>}
 */
function getOptions(loaderContext) {
  const query = loaderContext.query;

  if (typeof query === 'string' && query !== '') {
    return parseQuery(query);
  }

  if (!query || typeof query !== 'object') {
    // Not object-like queries are not supported.
    return {};
  }

  return query;
}

module.exports = getOptions;
