const assert = require('assert');
const main = require('./index.js');

process.__exit = process.exit;

process.exit = function(code) {
  if (process.__beforeExit) {
    if (process.__beforeExit(code)) {
      return process.__exit(code);
    }
    return false;
  }

  return process.__exit(code);
};

describe('node-main:index.js', function() {
  describe('sys function', function() {
    it('opts is not fill opts.exitOnEnd should be true', async function() {

      let end = false;

      process.__beforeExit = function() {
        assert.equal(end, true);
        process.__beforeExit = null;
        return false;
      }

      await main(function() {
        end = true;
      });
    });

    it('opts is not fill opts.exitOnError should be true', async function() {

      let end = false;

      process.__beforeExit = function() {
        assert.equal(end, false);
        process.__beforeExit = null;
        return false;
      };

      await main(function() {
        throw Error('error');
        end = false;
      });
    });


    it('opts.reStartOnError = true, exec fn should be restart when error', async function() {

      let step = 0,
        times = 0;

      process.__beforeExit = function() {
        assert.equal(step, 3);
        assert.equal(times, 1);

        process.__beforeExit = null;
        return false;
      };

      await main(function() {
        step++;
        if (step === 1) {
          step++;
          throw Error('error');
        }

        times++;
      }, {
        reStartOnError: true,
      });

    });



  });
});