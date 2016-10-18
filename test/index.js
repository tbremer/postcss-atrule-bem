import expect from 'expect';
import plugin from '../';
import { readFileSync } from 'fs';

const tests = [
  'base',
  'base-with-props',
  'multiple-inner',
  'multiple-blocks',
  'warning-element-nested-element'
];

describe('atrule-bem', () => {
  for (const test of tests) {
    describe(test, () => {
      it('should pass', () => {
        const testCss = readFileSync(`./test/fixture/${test}.assert.css`).toString();
        const expectedCss = readFileSync(`./test/fixture/${test}.expected.css`).toString();

        return plugin.process(testCss)
          .then(res => {
            expect(res.css).toEqual(expectedCss);
          });
      });
    });
  }
});
