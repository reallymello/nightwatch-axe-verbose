module.exports.command = function axeRun(selector = 'html', options = {}) {
  this.executeAsync(
    // eslint-disable-next-line no-shadow
    (selector, options, done) => {
      ((axe) => {
        if (!axe)
          done({
            error: 'aXe not found. Make sure it has been injected',
          });
        const el = document.querySelector(selector);

        axe.run(el, options, (err, results) => {
          if (err) {
            done({
              error: err.toString(),
            });
          }
          done({
            results,
          });
        });
      })(window.axe);
    },
    [selector, options],
    (response) => {
      // eslint-disable-next-line no-unused-vars
      const { error, results } = response.value;

      const { passes = [], violations = [] } = results;

      for (let i = 0; i < passes.length; i += 1) {
        this.assert.ok(
          true,
          `aXe rule: ${passes[i].id} (${passes[i].nodes.length} elements checked)`
        );
      }

      for (let i = 0; i < violations.length; i += 1) {
        for (let n = 0; n < violations[i].nodes.length; n += 1) {
          let nodeName = violations[i].nodes[n].target.toString();
          if (nodeName.length > 100) {
            nodeName = `...${nodeName.slice(-100)}`;
          }

          const assertionFailureMessage = `aXe rule: ${violations[i].id} - ${violations[i].help}\r\n\tIn element: ${nodeName}`;
          this.verify.fail(assertionFailureMessage);
        }
      }
    }
  );

  return this;
};
