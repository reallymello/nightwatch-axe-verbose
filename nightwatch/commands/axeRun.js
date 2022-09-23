const axeInjectFn = require('./_axeInjectFn');

module.exports = class AxeRun {
  command(selector = 'html', options = {}, callback = function cb() {}) {
    this.api.executeAsync(axeInjectFn, [selector, options], (response) => {
      const runAssertions =
        options.runAssertions || typeof options.runAssertions === 'undefined';
      const { results } = response.value;
      const { passes = [], violations = [] } = results;

      if (runAssertions) {
        for (let i = 0; i < passes.length; i += 1) {
          // eslint-disable-next-line
          this.api.assert.ok(true, `aXe rule: ${passes[i].id} (${passes[i].nodes.length} elements checked)`);
        }

        for (let i = 0; i < violations.length; i += 1) {
          for (let n = 0; n < violations[i].nodes.length; n += 1) {
            let nodeName = violations[i].nodes[n].target.toString();
            if (nodeName.length > 100) {
              nodeName = `...${nodeName.slice(-100)}`;
            }

            const assertionFailureMessage = `aXe rule: ${violations[i].id} - ${violations[i].help}\r\n\tIn element: ${nodeName}`;
            this.api.verify.fail(assertionFailureMessage);
          }
        }
      }

      callback(results);
    });

    return this;
  }
};
