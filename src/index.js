/* eslint-disable */
import postcss, { root as Root, rule as Rule } from 'postcss';
import { cleanChildren, generateSelector, prependAonB, childValidated } from './lib/utils';

export default postcss.plugin(
  'postcss-atrule-bem',
  opts => {
    const OPTIONS = Object.assign({}, {
      strict: true,
      warn: true,
      shortcuts: false,
      separators: {
        element: '__',
        modifier: '--'
      },
    }, opts); //eslint-disable-line object-property-newline
    
    if (OPTIONS.separators.element === undefined) {
      OPTIONS.separators.element = '__';
    }

    if (OPTIONS.separators.modifier === undefined) {
      OPTIONS.separators.modifier = '--';
    }
    
    let BLOCK;
    let ELEMENT;
    let MODIFIER;
    
    if (OPTIONS.shortcuts) {
      BLOCK = 'b';
      ELEMENT = 'e';
      MODIFIER = 'm';
    } else {
      BLOCK = 'block';
      ELEMENT = 'element';
      MODIFIER = 'modifier';
    }
    
    const VALID_RULES = [ BLOCK, ELEMENT, MODIFIER ];
    const VALID_CHILDREN = {
      [BLOCK]: [ ELEMENT, MODIFIER ],
      [ELEMENT]: [ MODIFIER ],
      [MODIFIER]: []
    };

    function recursiveWalker(container, previousSelector, parent, options, result) {
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

        const SELECTOR = prependAonB(previousSelector, generateSelector(node, ELEMENT, MODIFIER, OPTIONS));

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

        blockAtRule.walkAtRules(recursiveWalker(CONTAINER, BLOCK_SELECTOR, blockAtRule, OPTIONS, result));
        blockAtRule.replaceWith(cleanChildren(CONTAINER, VALID_RULES));
      });
    };
  }
);
