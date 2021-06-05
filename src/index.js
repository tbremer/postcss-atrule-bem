/* eslint-disable */
import postcss, { root as Root, rule as Rule } from 'postcss';
import { cleanChildren, generateSelector, prependAonB, childValidated } from './lib/utils';

export default postcss.plugin(
  'postcss-atrule-bem',
  opts => {
    const OPTIONS = Object.assign(
      {},
      {
        strict: true,
        warn: true,
        shortcuts: false,
        separators: {
          element: '__',
          modifier: '--'
        },
      },
      opts
    );

    if (OPTIONS.separators.element === undefined) {
      OPTIONS.separators.element = '__';
    }

    if (OPTIONS.separators.modifier === undefined) {
      OPTIONS.separators.modifier = '--';
    }

    const BLOCK = OPTIONS.shortcuts ? 'b' : 'block';
    const ELEMENT = OPTIONS.shortcuts ? 'e' : 'element';
    const MODIFIER = OPTIONS.shortcuts ? 'm' : 'modifier';
    const VALID_RULES = [ BLOCK, ELEMENT, MODIFIER ];
    const VALID_CHILDREN = {
      [BLOCK]: [ ELEMENT, MODIFIER ],
      [ELEMENT]: [ MODIFIER ],
      [MODIFIER]: [ ELEMENT ]
    };

    function recursiveWalker(container, previousSelector, parent, options, result, BLOCK_SELECTOR) {
      return function(node) {
        if (node.parent !== parent) return;
        if (VALID_RULES.indexOf(node.name) === -1) return;
        if (options.strict && !childValidated(node, node.parent, VALID_CHILDREN)) {
          node.__atrulebem__ = { valid: false };
          if (options.warn) {
            container.warn(result, `Type ${String(node.name)} cannot have child of ${String(node.parent.name)}`);
          }

          return;
        }

        const SELECTOR = prependAonB(previousSelector, generateSelector(node, ELEMENT, MODIFIER, OPTIONS, BLOCK_SELECTOR));

        container.append(
          new Rule({
            selector: SELECTOR.join(','),
            nodes: node.nodes
          })
        );

        if (node.nodes.length) {
          node.walkAtRules(recursiveWalker(container, SELECTOR, node, options, result, BLOCK_SELECTOR))
        }
      }
    }

    return function atruleBEM(root, result) {
      root.walkAtRules(BLOCK, blockAtRule => {
        const CONTAINER = new Root();
        const BLOCK_SELECTOR = generateSelector(blockAtRule, ELEMENT, MODIFIER, OPTIONS);

        CONTAINER.append(
          new Rule({
            selector: BLOCK_SELECTOR.join(','),
            nodes: blockAtRule.nodes
          })
        );

        blockAtRule.walkAtRules(recursiveWalker(CONTAINER, BLOCK_SELECTOR, blockAtRule, OPTIONS, result, BLOCK_SELECTOR));
        blockAtRule.replaceWith(cleanChildren(CONTAINER, VALID_RULES));
      });
    };
  }
);
