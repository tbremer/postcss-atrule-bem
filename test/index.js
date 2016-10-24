import expect from 'expect';
import postcss from 'postcss';
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

  describe('options', () => {
    it('silences warnings', () => {
      const options = { warn: false };
      const css = `
@block a {
  @block b {}
}`.trim();
      const expected = `
.a {
    @block b {}
}`.trim();

      return postcss(plugin(options)).process(css)
        .then(res => {
          expect(res.css).toEqual(expected);
          expect(res.warnings.length).toEqual(0);
        });
    });

    it('loosely produces components', () => {
      const options = { strict: false };
      const css = `
@block a {
  @block b {}
}`.trim();
      const expected = `
.a {}
.a.b {}`.trim();

      return postcss(plugin(options)).process(css)
        .then(res => {
          expect(res.css).toEqual(expected);
          expect(res.warnings.length).toEqual(0);
        });
    });
  });
});
