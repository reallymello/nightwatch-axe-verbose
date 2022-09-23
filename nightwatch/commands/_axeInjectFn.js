/* eslint-disable */
module.exports = function (selector, options, done) {
  var axe = window.axe;
  if (!axe) {
    done({
      error: 'aXe not found. Make sure it has been injected',
    });
    return;
  }

  const el = document.querySelector(selector);

  axe.run(el, options, function (err, results) {
    if (err) {
      done({
        error: err.toString(),
      });
      return;
    }

    done({results: results});
  });
};
