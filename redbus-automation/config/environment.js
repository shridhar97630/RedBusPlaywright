const path = require('node:path');

const config = Object.freeze({
  baseUrl: process.env.BASE_URL || 'https://www.redbus.in',
  headless: process.env.HEADLESS !== 'false',
  artifacts: Object.freeze({
    screenshots: path.resolve(__dirname, '..', 'screenshots'),
    traces: path.resolve(__dirname, '..', 'traces'),
    videos: path.resolve(__dirname, '..', 'videos'),
  }),
});

module.exports = config;
