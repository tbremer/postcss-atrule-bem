import expect from 'expect';
import postcss from 'postcss';
import plugin from '../src/index';
import { readFileSync } from 'fs';

const tests = [
  'base',
  'multiple-rules',
  'base-with-props',
  'multiple-inner',
  'multiple-blocks',
  'dont-affect-other-atrules',
  'warning-block-in-block',
  'warning-element-in-element',
  'warning-modifier-in-modifier',
  'warning-element-in-modifier'
];

describe('atrule-bem', () => {
  describe('should pass', () => {
    for (const test of tests) {
      it(test, () => {
        const testCss = readFileSync(`./test/fixture/simple/${test}.assert.css`).toString();
        const expectedCss = readFileSync(`./test/fixture/simple/${test}.expected.css`).toString();

        return plugin.process(testCss)
          .then(res => {
            expect(res.css).toEqual(expectedCss);
            if (/warning/.test(test)) {
              expect(res.messages.length).toEqual(1);
            }
          });
      });
    }
  });

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

    it('changes element separator', () => {
      const options = {
        separators: {
          element: '-'
        }
      };
      const css = `
@block a {
  @element b {
    @modifier c {}
  }
}`.trim();
      const expected = `
.a {}
.a-b {}
.a-b--c {}`.trim();

      return postcss(plugin(options)).process(css)
        .then(res => {
          expect(res.css).toEqual(expected);
          expect(res.warnings.length).toEqual(0);
        });
    });

    it('changes modifier separator', () => {
      const options = {
        separators: {
          modifier: '_'
        }
      };
      const css = `
@block a {
  @element b {
    @modifier c {}
  }
}`.trim();
      const expected = `
.a {}
.a__b {}
.a__b_c {}`.trim();

      return postcss(plugin(options)).process(css)
        .then(res => {
          expect(res.css).toEqual(expected);
          expect(res.warnings.length).toEqual(0);
        });
    });

    it('changes element and modifier separators', () => {
      const options = {
        separators: {
          element: '-',
          modifier: '_'
        }
      };
      const css = `
@block a {
  @element b {
    @modifier c {}
  }
}`.trim();
      const expected = `
.a {}
.a-b {}
.a-b_c {}`.trim();

      return postcss(plugin(options)).process(css)
        .then(res => {
          expect(res.css).toEqual(expected);
          expect(res.warnings.length).toEqual(0);
        });
    });

    describe('shortcuts support', () => {
      for (const test of tests) {
        it(test, () => {
          const options = { shortcuts: true };
          const testCss = readFileSync(`./test/fixture/shortcuts/${test}.assert.css`).toString();
          const expectedCss = readFileSync(`./test/fixture/shortcuts/${test}.expected.css`).toString();

          return postcss(plugin(options)).process(testCss)
            .then(res => {
              expect(res.css).toEqual(expectedCss);
              if (/warning/.test(test)) {
                expect(res.messages.length).toEqual(1);
              }
            });
        });
      }
    });
  });
});
