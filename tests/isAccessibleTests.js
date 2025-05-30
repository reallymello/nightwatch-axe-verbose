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
            <img id='blankImage' src='about:blank' alt='picture of nothing'/>
            <img id='blankImage1' src='about:blank' alt='picture of nothing1'/>
            <img id='blankImage2' src='about:blank' alt='picture of nothing2'/>
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

  it('Can assert for rule violations', (browser) => {
    browser.frame('#theIframe');
    browser.axeInject().assert.isAccessible('body', {
      runOnly: ['color-contrast', 'image-alt'],
    });
  });

  it('Can assert for rule violations and violation count async', async (browser) => {
    await browser.frame('#theIframe');
    await browser.axeInject().assert.isAccessible(
      'body',
      {
        runOnly: ['region', 'image-alt'],
      },
      0
    );
  });
});
