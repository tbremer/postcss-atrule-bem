/* eslint-disable */
import postcss, { root as Root, rule as Rule } from 'postcss';
import {
  BLOCK,
  ELEMENT,
  MODIFIER,
  VALID_RULES
} from './lib/constants';
import { cleanChildren, generateSelector, prependAonB, childValidated } from './lib/utils';

function recursiveWalker(container, previousSelector, parent, options, result) {
  return function(node) {
    if (node.parent !== parent) return;
    if (VALID_RULES.indexOf(node.name) === -1) return;
    if (options.strict && !childValidated(node, node.parent)) {
      node.__atrulebem__ = { valid: false };
      if (options.warn) {
        container.warn(result, `Type ${String(node.name)} cannot have child of ${String(node.parent.name)}`);
      }

      return;
    }

    const SELECTOR = prependAonB(previousSelector, generateSelector(node));

    container.append(
      new Rule({
        selector: SELECTOR.join(','),
        nodes: node.nodes
      })
    );

    if (node.nodes.length) {
      node.walkAtRules(recursiveWalker(container, SELECTOR, node, options, result))
    }
  }
}

export default postcss.plugin(
  'postcss-atrule-bem',
  opts => {
    const OPTIONS = Object.assign({}, { strict: true, warn: true }, opts); //eslint-disable-line object-property-newline

    return function atruleBEM(root, result) {
      root.walkAtRules(BLOCK, blockAtRule => {
        const CONTAINER = new Root();
        const BLOCK_SELECTOR = generateSelector(blockAtRule);

        CONTAINER.append(
          new Rule({
            selector: BLOCK_SELECTOR.join(','),
            nodes: blockAtRule.nodes
          })
        );

        blockAtRule.walkAtRules(recursiveWalker(CONTAINER, BLOCK_SELECTOR, blockAtRule, OPTIONS, result));
        blockAtRule.replaceWith(cleanChildren(CONTAINER));
      });
    };
  }
);
