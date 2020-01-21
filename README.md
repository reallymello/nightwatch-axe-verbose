# nightwatch-axe-verbose
Verbose error reporting for axe accessibility rule violations to use in NightwatchJS

This fork of nightwatch-axe is more verbose in that it will report each passing rule run and how many elements it was run against. In addition, each rule failure will be counted individually against each failing element so downstream failures are not hidden.

Nightwatch.js custom commands for aXe allowing Nightwatch to be used as an [automated accessibility testing tool](https://www.davidmello.com/accessibility-testing-with-nightwatchjs/).

## Installation instructions
```
npm install nightwatch-axe-verbose -save
```
In nightwatch.json add this entry:
```
"custom_commands_path": ["./node_modules/nightwatch-axe-verbose/src/commands"]
```

## axeInject()
Injects the axe-core js library into your test page

## axeRun(options)
Analyzes the current page against applied axe rules

## Example test

AxeRun takes as a first parameter the selector of the element you want to run the axe test against. If you do it on a larger containing element such as the body all the inner elements will be scanned.

```
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
```
√ Passed [ok]: aXe rule: aria-hidden-body (1 elements checked)
√ Passed [ok]: aXe rule: color-contrast (62 elements checked)
√ Passed [ok]: aXe rule: duplicate-id-aria (1 elements checked)
```
Failures
```
× Failed [fail]: (aXe rule: button-name - Buttons must have discernible text
        In element: .departure-date > .ui-datepicker-trigger:nth-child(4))

× Failed [fail]: (aXe rule: color-contrast - Elements must have sufficient color contrast
        In element: a[href="mars2\.html\?a\=be_bold"] > h3)
                
```


