describe('axe nightwatch integration tests', () => {
  beforeEach((browser) => {
    // eslint-disable-next-line no-param-reassign
    delete browser.globals.axeSettings;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>In-Memory Page</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        #header { font-size: 24px; font-weight: bold; margin: 20px; }
    </style>
</head>
<body>
    <div id="header">This is the header</div>
    <iframe id="theIframe" src="data:text/html;charset=utf-8,
        <html>
        <body>
          <main>
            <img id='blankImage' src='about:blank' alt='picture of nothing'>
          </main>
        </body>
        </html>" 
        width="300" height="200" style="border:1px solid black;">
    </iframe>
</body>
</html>
`;

    const encodedHtml = encodeURIComponent(htmlContent);
    const dataUrl = `data:text/html;charset=utf-8,${encodedHtml}`;

    // Navigate to the generated page in Nightwatch or a browser
    browser.url(dataUrl);
  });

  afterEach((browser) => {
    browser.end();
  });

  it('Can run axe rules in iframe', (browser) => {
    browser.frame('#theIframe');
    browser
      .axeInject()
      .axeRun('body', {
        rules: { 'color-contrast': { enabled: false } },
      })
      .perform(() => {
        browser.assert.strictEqual(
          browser.currentTest.results.assertions.length,
          8,
          'There are 8 assertons performed'
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

  it('Can run axe rules in iframe async', async (browser) => {
    await browser.frame('#theIframe');
    const result = await browser.axeInject().axeRun('body', {
      rules: { 'color-contrast': { enabled: false } },
    });

    // eslint-disable-next-line no-undef
    expect(result.passes.length).to.equal(8);
  });
});
