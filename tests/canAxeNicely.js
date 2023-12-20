describe('axe nightwatch integration tests', () => {
  beforeEach((browser) => {
    // eslint-disable-next-line no-param-reassign
    delete browser.globals.axeSettings;
  });

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

  it('Will read axe settings from globals if not provided in test', (browser) => {
    // eslint-disable-next-line no-param-reassign
    browser.globals.axeSettings = {
      options: {
        runOnly: ['color-contrast', 'image-alt', 'nested-interactive'],
      },
    };

    browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun('body', null, (results) => {
        browser.assert.ok(
          'violations' in results,
          'axe results are available in the callback'
        );
      })
      .perform(() => {
        browser.assert.strictEqual(
          browser.currentTest.results.assertions.length,
          5,
          'There are 5 assertons performed'
        );
        browser.assert.strictEqual(
          browser.currentTest.results.assertions.some((e) =>
            e.message.includes('nested-interactive')
          ),
          true,
          'Expected assertions array to contain nested-interactive rule from global settings'
        );
      });
  });

  it('Will combine axe settings from globals and those provided in test', (browser) => {
    // eslint-disable-next-line no-param-reassign
    browser.globals.axeSettings = {
      options: {
        rules: {
          'color-contrast': { enabled: false },
          'aria-hidden-body': { enabled: true },
        },
      },
    };

    browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun(
        'body',
        {
          runOnly: {
            type: 'tag',
            values: ['wcag2a'],
          },
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
          browser.currentTest.results.assertions.some((e) =>
            e.message.includes('aria-hidden-body')
          ),
          true
        );
        browser.assert.strictEqual(
          browser.currentTest.results.assertions.some((e) =>
            e.message.includes('color-contrast')
          ),
          false
        );
      });
  });

  it('Will use selector context from test instead of globals', (browser) => {
    // eslint-disable-next-line no-param-reassign
    browser.globals.axeSettings = {
      context: 'html',
    };

    browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun('#meta-header', null, (results) => {
        browser.assert.ok(
          'violations' in results,
          'axe results are available in the callback'
        );
      })
      .perform(() => {
        browser.assert.strictEqual(
          browser.currentTest.results.assertions.length,
          12,
          'There are 13 assertons performed'
        );
      });
  });
  it('Will use global context if not supplied by test', (browser) => {
    // eslint-disable-next-line no-param-reassign
    browser.globals.axeSettings = {
      context: 'img[src="./img/panda-sm.jpg"]',
    };

    browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun(null, null, (results) => {
        browser.assert.ok(
          'violations' in results,
          'axe results are available in the callback'
        );
      })
      .perform(() => {
        browser.assert.strictEqual(
          browser.currentTest.results.assertions.length,
          5,
          'There are 5 assertons performed'
        );
      });
  });

  it('Will read both context and options from globals if none supplied by test', async (browser) => {
    // eslint-disable-next-line no-param-reassign
    browser.globals.axeSettings = {
      context: 'img[src="./img/panda-sm.jpg"]',
      options: { runOnly: ['image-alt'] },
    };

    const results = await browser
      .url('https://www.w3.org/WAI/demos/bad/after/home.html')
      .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
      .axeInject()
      .axeRun();

    // eslint-disable-next-line no-undef
    expect(results.passes.length).to.equal(1);
    // eslint-disable-next-line no-undef
    expect(results.passes[0].id).to.equal('image-alt');
    // eslint-disable-next-line no-undef
    expect(results.passes[0].nodes.length).to.equal(1);
    // eslint-disable-next-line no-undef
    expect(results.passes[0].nodes[0].target).to.eql([
      'img[src$="panda-sm.jpg"]',
    ]);
  });
});
