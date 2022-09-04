const Events = require('events');
module.exports = class AxeRun {
  async command(selector = 'html', options = {}) {
    const value = await this.api.executeAsync(
      function (selector, options, done) {
        (function (axe) {
          if (!axe)
            done(new Error('aXe not found. Make sure it has been injected'));
          var el = document.querySelector(selector);

          axe.run(el, options, function (err, results) {
            if (err) {
              done(err);
            }
            done({
              results: results
            });
          });
        })(window.axe);
      },
      [selector, options]
    );
    const { results } = value;

    const { passes = [], violations = [] } = results;

    const Asserts = passes.map((pass) =>
      this.api.assert.ok(
        true,
        `aXe rule: ${pass.id} (${pass.nodes.length} elements checked)`
      )
    );
    const failures = violations.map((violate) => {
      let nodeName = violate.nodes[n].target.toString();
      if (nodeName.length > 100) {
        nodeName = '...' + nodeName.slice(-100);
      }

      let assertionFailureMessage = `aXe rule: ${violate.id} - ${violate.help}\r\n\tIn element: ${nodeName}`;
      return this.api.verify.fail(assertionFailureMessage);
    });

    return await Promise.all([...Asserts, ...failures]);
  }
};
