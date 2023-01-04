describe('axe nightwatch integration tests', () => {
  afterEach((browser) => {
    browser.end();
  });

  it('Accessible rule subset will pass on friendly site', (browser) => {
    browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun(
        'body',
        {
          runOnly: ['color-contrast', 'image-alt'],
        },
        (results) => {
          browser.assert.ok(
            'violations' in results,
            'axe results are available in the callback'
          );
        }
      )
      .perform(() => {
        browser.assert.strictEqual(
          browser.currentTest.results.assertions.length,
          4,
          'There are 4 assertons performed'
        );
      });
  });

  it('Run axe without assertions', (browser) => {
    browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun(
        'body',
        {
          runAssertions: false,
          runOnly: ['color-contrast', 'image-alt'],
        },
        (results) => {
          browser.assert.ok(
            'violations' in results,
            'axe results are available in the callback'
          );
        }
      )
      .perform(() => {
        browser.assert.strictEqual(
          browser.currentTest.results.assertions.length,
          2,
          'There are 2 assertons performed'
        );
      });
  });

  it('Can use command from page objects', (browser) => {
    browser.page
      .home()
      .navigate()
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun('#header', {
        rules: {
          'nested-interactive': {
            enabled: false,
          },
          'select-name': {
            enabled: true,
          },
        },
      });
  });

  it('can use axe command from async function', async (browser) => {
    const results = await browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun('body', {
        runOnly: ['color-contrast', 'image-alt'],
      });
    browser.assert.ok(
      'violations' in results,
      'axe results are available in the result'
    );
  });
});
