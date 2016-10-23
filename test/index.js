import expect from 'expect';
import plugin from '../index';
import { readFileSync } from 'fs';

const tests = [
  'base',
  'base-with-props',
  'multiple-inner',
  'multiple-blocks',
  'warning-block-in-block',
  'warning-element-in-element',
  'warning-modifier-in-modifier',
  'warning-element-in-modifier'
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
            if (/warning/.test(test)) {
              expect(res.messages.length).toEqual(1);
            }
          });
      });
    });
  }
});
