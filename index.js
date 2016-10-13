import * as postcss from 'postcss';

const BLOCK = 'block';
const ELEMENT = 'element';
const MODIFIER = 'modifier';
const SUBRULES = [ ELEMENT, MODIFIER ];

function createSelector(baseClass, selector, type) {
  switch (type) {
    case ELEMENT: return `${baseClass}__${selector}`;
    case MODIFIER: return `${baseClass}--${selector}`;
    default: return `.${selector}`;
  }
}

function walkChildren(rule, root) {
  for (const node of rule.nodes) {
    if (node.type !== 'atrule') continue;
    if (SUBRULES.indexOf(node.name) === -1) continue;

    const selector = createSelector(rule.selector, node.params, node.name);
    const newRule = postcss.rule({
      selector,
      nodes: node.nodes
    });

    root.append(newRule);
    walkChildren(newRule, root);
  }
}

function recursivelyCleanChildren(node) {
  for (const n of node.nodes) {
    n.nodes.reduce((all, curr) => {
      if (curr.type !== 'atrule') return all;
      if (SUBRULES.indexOf(curr.name) === -1) return all;
      all.push(curr);

      return all;
    }, [])
    .forEach(_ => n.removeChild(_));
  }
}

export default postcss.plugin('postcss-atrule-bem', () => { //eslint-disable-line
  return root => {
    root.walkAtRules(BLOCK, rule => {
      const container = postcss.root();
      const clone = rule.clone();
      const baseSelector = createSelector(undefined, clone.params, clone.name);
      const baseRule = postcss.rule({
        selector: baseSelector,
        nodes: rule.nodes
      });

      walkChildren(baseRule, container);
      container.prepend(baseRule);
      recursivelyCleanChildren(container);
      rule.replaceWith(...container.nodes);
    });
  };
});
