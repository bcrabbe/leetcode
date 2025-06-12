// import _ from 'lodash';
// import R from 'ramda';
// import assert from 'assert';
import Mocha from 'mocha';

const mocha = new Mocha();
// Required to ensure `describe` and `it` are available in this context
mocha.suite.emit('pre-require', globalThis, 'solution', mocha);

describe('method', () => {
  it('should work', () => {
    // const input = ["cheapair", "cheapoair", "peloton", "pelican"];
    // const result = getShortestUniqueSubstrings(input);

    // const expected: UniqueSubstrings = {
    //   cheapair: "pa",
    //   cheapoair: "po",
    //   peloton: "t",
    //   pelican: "li"
    // };

    // assert.strictEqual(result["cheapair"], expected["cheapair"]);
    // assert.strictEqual(result["cheapoair"], expected["cheapoair"]);
    // assert.strictEqual(result["peloton"], expected["peloton"]);
    // assert.strictEqual(result["pelican"], expected["pelican"]);
  });
});

mocha.run();
