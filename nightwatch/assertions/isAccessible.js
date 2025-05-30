exports.assertion = function (
  selector = null,
  options = {},
  expectedViolations = 0
) {
  const originalTimeoutSetting = this.retryAssertionTimeout;
  this.retryAssertionTimeout = -1;
  let actualViolations;
  let axeViolationsPerElement = '';

  /**
   * Returns the message format which will be used to output the message in the console and also
   *  the arguments which will be used for replace the place holders, used in the order of appearance
   *
   * The message format also takes into account whether the .not negate has been used
   *
   * @return undefined
   */
  this.formatMessage = () => {
    // Use this.negate to determine if ".not" is in use
    // Example:
    const message = `Testing if elements within <${selector}> ${
      this.negate
        ? 'contain'
        : `don't contain${
            expectedViolations === 0 ? '' : ` more than ${expectedViolations}`
          } accessibility rule violations`
    }`;

    return {
      message,
      args: [],
    };
  };

  /**
   * Returns the expected value of the assertion which is displayed in the case of a failure
   *
   * @return {string}
   */
  this.expected = () =>
    this.negate
      ? `is not '${expectedViolations}'`
      : `is '${expectedViolations}'`;

  /**
   * Given the value, the condition used to evaluate if the assertion is passed
   * @param {*} value
   * @return {Boolean}
   */
  this.evaluate = (value) => {
    this.retryAssertionTimeout = originalTimeoutSetting;
    return value <= expectedViolations;
  };

  /**
   * Called with the result object of the command to retrieve the value which is to be evaluated
   *
   * @param {Object} result
   * @return {*}
   */
  this.value = (result) => {
    actualViolations = result.value.violations.length;
    return actualViolations;
  };

  /**
   * When defined, this method is called by the assertion runner with the command result, to determine if the
   *  value can be retrieved successfully from the result object
   *
   * @param result
   * @return {boolean|*}
   */
  this.failure = (result) =>
    result === false || (result && result.status === -1);

  /**
   * When defined, this method is called by the assertion runner with the command result to determine the actual
   *  state of the assertion in the event of a failure
   *
   * @param {Boolean} passed
   * @return {string}
   */
  this.actual = (passed) =>
    passed
      ? `contained ${actualViolations}`
      : `${actualViolations} rule violation${
          actualViolations > 0 ? '' : 's'
        } (details below)\r\n${axeViolationsPerElement}`;

  /**
   * The command which is to be executed by the assertion runner; Nightwatch api is available as this.api
   * @param {function} callback
   */
  this.command = (callback) => {
    this.api.perform(async () => {
      const axeResults = await this.api.axeRun(selector, {
        ...options,
        runAssertions: false,
      });

      // For informative logging of passes when passing
      if (axeResults && axeResults.passes && axeResults.violations) {
        axeResults.passes.forEach((pass) => {
          this.api.assert.ok(
            true,
            `aXe rule: ${pass.id} (${pass.nodes.length} elements checked)`
          );
        });

        axeViolationsPerElement = axeResults.violations
          .flatMap((violation) =>
            violation.nodes.map((node) => {
              let nodeName = node.target.toString();
              if (nodeName.length > 100) {
                nodeName = `...${nodeName.slice(-100)}`;
              }
              return `\r\n   aXe rule [${violation.impact}]: ${violation.id} - ${violation.help} [${violation.helpUrl}]\r\n\tIn element: ${nodeName}`;
            })
          )
          .join('');
      }

      callback({ value: axeResults });
    });
  };
};
