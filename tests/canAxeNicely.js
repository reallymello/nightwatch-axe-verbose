module.exports = {
  'Accessible rule subset will pass on friendly site': (browser) => {
    browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun('body', {
        // runOnly: ['color-contrast', 'image-alt'],
      })
      .end();
  },
};
