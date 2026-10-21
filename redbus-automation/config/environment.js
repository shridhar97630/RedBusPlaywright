const path = require('node:path');
const routes = require('../test-data/search-data.json');

function getBrowserProxy() {
  const proxyAddress = process.env.PLAYWRIGHT_PROXY;

  if (!proxyAddress) {
    return undefined;
  }

  let proxyUrl;
  try {
    proxyUrl = new URL(proxyAddress);
  } catch {
    throw new Error('PLAYWRIGHT_PROXY must be a valid proxy URL.');
  }

  if (!['http:', 'https:', 'socks4:', 'socks5:'].includes(proxyUrl.protocol)) {
    throw new Error(
      'PLAYWRIGHT_PROXY must use http, https, socks4, or socks5 protocol.',
    );
  }

  if (proxyUrl.pathname !== '/' || proxyUrl.search || proxyUrl.hash) {
    throw new Error(
      'PLAYWRIGHT_PROXY must contain only a proxy origin and optional credentials.',
    );
  }

  const proxy = {
    server: `${proxyUrl.protocol}//${proxyUrl.host}`,
  };

  if (proxyUrl.username || proxyUrl.password) {
    proxy.username = decodeURIComponent(proxyUrl.username);
    proxy.password = decodeURIComponent(proxyUrl.password);
  }

  return Object.freeze(proxy);
}

const routeKey = process.env.TEST_ROUTE || 'puneToMumbai';
const route = routes[routeKey];

if (!route) {
  throw new Error(
    `Unknown TEST_ROUTE "${routeKey}". Available routes: ${Object.keys(routes).join(', ')}`,
  );
}

module.exports = Object.freeze({
  baseUrl: process.env.BASE_URL || 'https://www.redbus.in',
  headless: process.env.HEADLESS !== 'false',
  navigationTimeoutMs: Number(process.env.NAVIGATION_TIMEOUT_MS || 60_000),
  browserProxy: getBrowserProxy(),
  http1Bridge:
    process.env.RED_BUS_CURL_BRIDGE === 'true' ||
    (!process.env.PLAYWRIGHT_PROXY &&
      process.env.RED_BUS_CURL_BRIDGE !== 'false'),
  routeKey,
  route,
  artifacts: Object.freeze({
    screenshots: path.resolve(__dirname, '..', 'screenshots'),
    traces: path.resolve(__dirname, '..', 'traces'),
    videos: path.resolve(__dirname, '..', 'videos'),
  }),
});
