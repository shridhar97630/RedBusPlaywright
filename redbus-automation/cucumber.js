module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    import: [],
    require: [
      'support/**/*.js',
      'step-definitions/**/*.js',
    ],
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      'merv-client-cucumber',
    ],
    formatOptions: {
      merv: {
        cwd: process.cwd(),
      },
    },
    publishQuiet: true,
    retry: process.env.CI ? 1 : 0,
    parallel: 1,
    strict: true,
    tags: process.env.CUCUMBER_TAGS || undefined,
  },
};
