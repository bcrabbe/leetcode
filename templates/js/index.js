import _ from 'lodash';
import * as R from 'ramda';
import Mocha from 'mocha';
import assert from 'assert';
import util from 'util';

const mocha = new Mocha();
mocha.suite.emit('pre-require', globalThis, 'solution', mocha);

const deepLog = (...args) => {
  const inspectedArgs = args.map(arg =>
    typeof arg === 'object' ? util.inspect(arg, { depth: null, colors: true }) : arg
  );
  originalLog(...inspectedArgs);
};

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => i + start);

describe('Test suite', () => {
  it('should work', () => {
    assert.equal([1, 2, 3].length, 3);
  });
});

mocha.run();
