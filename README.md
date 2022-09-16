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

## axeRun(options)

Analyzes the current page against applied axe rules

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
