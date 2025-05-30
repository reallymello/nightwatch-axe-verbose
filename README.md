# nightwatch-axe-verbose

[![Node.js CI](https://github.com/reallymello/nightwatch-axe-verbose/actions/workflows/node.js.yml/badge.svg)](https://github.com/reallymello/nightwatch-axe-verbose/actions/workflows/node.js.yml)

Verbose error reporting for axe accessibility rule violations to use in NightwatchJS

This fork of nightwatch-axe is more verbose in that it will report each passing rule run and how many elements it was run against. In addition, each rule failure will be counted individually against each failing element so downstream failures are not hidden.

Nightwatch.js custom commands for aXe allowing Nightwatch to be used as an [automated accessibility testing tool](https://www.davidmello.com/accessibility-testing-with-nightwatchjs/).

## Installation instructions

**NOTE: If you are using [Nightwatch 2.3.6](https://github.com/nightwatchjs/nightwatch/releases/tag/v2.3.6) or greater this is now pre-included as a default plugin in the Nightwatch installation so you can skip this install section**

```sh
npm install nightwatch-axe-verbose --save-dev
```

### Plugin Install (Recommended method for Nightwatch >= 2.0)

In nightwatch.conf.js add `nightwatch-axe-verbose` to the plugins property array.

#### nightwatch.conf.js

```js
{
  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-plugins.html
  plugins: ['nightwatch-axe-verbose'];
}
```

If you are using an older Nightwatch version or prefer the prior custom_commands_path option that will still work instead, but the path has changed from `src/commands` to `nightwatch/commands` as shown below. **You must update the path or use the plugin pattern above starting with v2 of nightwatch-axe-verbose**.

```js
"custom_commands_path": ["./node_modules/nightwatch-axe-verbose/nightwatch/commands"]
```

## axeInject()

Injects the axe-core js library into your test page

## axeRun(selector, options)

Analyzes the current page against applied axe rules

## assert.isAccessible(selector, options, expectedViolationCount)

Same as axeRun, but uses the Nightwatch assertion library instead of using a command which will allow better stack traces to appear in the Nightwatch HTML report. `expectedViolationCount` is optional and defaults to 0, but can be set to a number greater than 0 to allow for up to the provided number of rule violations.

## Example test

AxeRun takes as a first parameter the selector of the element you want to run the axe test against. If you do it on a larger containing element such as the body all the inner elements will be scanned.

```js
module.exports = {
    '@tags': ['accessibility'],
    'ensure site is accessible': function (browser) {
     browser
            .url('https://dequeuniversity.com/demo/mars/')
            .axeInject()
            .axeRun('body', {
                rules: {'color-contrast': { enabled: false }}
            })
            .end();
    }
```

## Example output

Passes

```sh
√ Passed [ok]: aXe rule: aria-hidden-body (1 elements checked)
√ Passed [ok]: aXe rule: color-contrast (62 elements checked)
√ Passed [ok]: aXe rule: duplicate-id-aria (1 elements checked)
```

Failures

```sh
× Failed [fail]: (aXe rule: button-name - Buttons must have discernible text
        In element: .departure-date > .ui-datepicker-trigger:nth-child(4))

× Failed [fail]: (aXe rule: color-contrast - Elements must have sufficient color contrast
        In element: a[href="mars2\.html\?a\=be_bold"] > h3)

```

## Example test using assert.isAccessible

```ts
it('Can check for tabindex rules', (browser) => {
  browser
    .url('https://dequeuniversity.com/demo/mars/')
    .axeInject()
    .assert.isAccessible('body', {
      runOnly: ['tabindex'],
    });
});
```

### Example output

```sh
   Testing if elements within <body> don't contain accessibility rule violations - expected "is '0'" but got: "1 rule violation (details below)

   aXe rule [serious]: tabindex - Elements should not have tabindex greater than zero [https://dequeuniversity.com/rules/axe/4.10/tabindex?application=axeAPI]
        In element: #from0
   aXe rule [serious]: tabindex - Elements should not have tabindex greater than zero [https://dequeuniversity.com/rules/axe/4.10/tabindex?application=axeAPI]
        In element: #to0
   aXe rule [serious]: tabindex - Elements should not have tabindex greater than zero [https://dequeuniversity.com/rules/axe/4.10/tabindex?application=axeAPI]
        In element: #deptDate0
   aXe rule [serious]: tabindex - Elements should not have tabindex greater than zero [https://dequeuniversity.com/rules/axe/4.10/tabindex?application=axeAPI]
        In element: #time0" (576ms)
```

## Default Run Settings

If no parameter inputs are supplied to .axeRun() it will default to the `html` context (scan all elements on the page) and run with all the default rule options from axe.

## Global Configuration

axeRun can read the selector context and/or run options from the Nightwatch globals collection so that they don't need to be passed in during each test if you have a globally applicable customized non-default scanning preference. These settings are expected under `axeSettings` and can contain `context` and/or `options` properties containing axe-core context and option settings respectively.

If a selector context is passed in to axeRun by the test it will override, take precedence over, the global setting. Global option properties not supplied by the test will be merged together with the ones provides by the test. The test-supplied value will be used in the case of same-named properties.

```js
// nightwatch.conf.js
test_settings: {
    default: {
        globals: {
                axeSettings: {
                        context: 'html',
                }
        }
    }
}
```

The above example sets these on the default global configuration. If you set these in the non-default test settings you can have multiple different axeSettings per environment configuration if you prefer.

Given this example global configuration one could expect the following.

#### Example 1

`.axeRun()` ➡️ Run against all page elements except for ones with or inside the .ad-banner class applied. Use all rules except color-contrast.

#### Example 2

`.axeRun('body')` ➡️ Run against all page elements contained inside the body element. Use all rules except color-contrast.

#### Example 3

```js
.axeRun('body', {
        rules: {
          'nested-interactive': {
            enabled: false,
          },
          'select-name': {
            enabled: true,
          },
        },
})
```

➡️ Run against all page elements contained inside the body element. Use all rules except nested-interactive. Note, this overrides the global setting against color-contrast since both provide a value for `rules` and the one supplied from the test takes precedence.

#### Example 4

`.axeRun('body', { otherValidAxeSetting: { something: true }})` ➡️ Run against all page elements contained inside the body element. Run with the `rules` settings supplied from the global configuration (disable color contrast), since the `rules` setting was not supplied by the test, and additionally include/use `otherValidAxeSetting` supplied by the test.
