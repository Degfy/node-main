const defaultOpts = {
  exitOnEnd: true,
  exitOnError: true,
  consoleError: console.error,

  reStartOnError: false,
};


module.exports = async function main(fn, opts = {}) {
  const { exitOnEnd, exitOnError } = Object.assign({}, defaultOpts, opts);

  try {
    if (typeof fn === 'function') {
      await fn();
    }

    if (exitOnEnd) {
      process.exit();
    }
  } catch (err) {
    if (consoleError) {
      consoleError(err);
    }

    if (reStartOnError) {
      process.nextTick(_ => {
        main(fn, opts);
      });
    } else if (exitOnError) {
      process.exit();
    }
  }
}