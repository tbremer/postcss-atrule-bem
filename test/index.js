import expect from 'expect';
import plugin from '../';
import { readFileSync } from 'fs';

describe('atrule-bem', () => {
  [
    //'base',
    //'base-with-props',
    //'multiple-inner',
    'multiple-blocks'
  ].forEach(file => {
    it(`${file} should process correctly`, done => {
      const testCss = readFileSync(`./test/fixture/${file}.assert.css`).toString();
      const expectedCss = readFileSync(`./test/fixture/${file}.expected.css`).toString();

      plugin.process(testCss)
        .then(res => {
          console.log('results:\n', res.css);
          console.log('expectedCss:\n', expectedCss);
          console.log('------');
          console.log();

          expect(res.css).toBe(expectedCss, 'Plugin output and Expected don\'t match');
          done();
        });
    });
  });
});
