import postcss from 'postcss';

const BLOCK = 'block';
const ELEMENT = 'element';
const MODIFIER = 'modifier';
const VALIDRULES = [ BLOCK, ELEMENT, MODIFIER ];
const validChildren = {
  [BLOCK]: [ ELEMENT, MODIFIER ],
  [ELEMENT]: [ MODIFIER ],
  [MODIFIER]: []
};
const BASE_OPTIONS = {
  strict: true,
  warn: true
};

function separatorByName(name) {
  switch (name) {
    case ELEMENT: return '__';
    case MODIFIER: return '--';
    default: return '.';
  }
}

function classGenerator(obj) {
  return `${separatorByName(obj.type)}${obj.value}`;
}

function selectorObjsToString(selectors) {
  let str = '';

  for (const obj of selectors) {
    str += classGenerator(obj);
  }

  return str;
}

function generateSelector(rule, selectors = []) {
  selectors.push({
    type: rule.name,
    value: rule.params
  });

  if (rule.parent && rule.parent.type !== 'root') {
    return generateSelector(rule.parent, selectors);
  }

  return selectorObjsToString(selectors.reverse());
}

function childValidated(child, parent) {
  return validChildren[parent.name].indexOf(child.name) !== -1;
}

function cleanChildren(container) {
  const clone = container.clone();

  for (const rule of clone.nodes) {
    rule.nodes.reduce((a, c) => {
      if (c.type !== 'atrule') return a;
      if (c.__atrulebem__ && !c.__atrulebem__.valid) return a;
      if (VALIDRULES.indexOf(c.name) === -1) return a;

      a.push(c);

      return a;
    }, [])
      .forEach(_ => rule.removeChild(_));
  }

  return clone;
}

function getOption(name, options) {
  return options && name in options ? options[name] : BASE_OPTIONS[name];
}

function getOptions(options) {
  return {
    strict: getOption('strict', options),
    warn: getOption('warn', options)
  };
}

export default postcss.plugin('postcss-atrule-bem', options => {
  const opts = getOptions(options);

  return (root, result) => {
    root.walkAtRules(BLOCK, block => {
      const container = postcss.root();

      container.append(postcss.rule({
        selector: generateSelector(block),
        nodes: block.nodes
      }));

      block.walkAtRules(child => {
        if (VALIDRULES.indexOf(child.name) === -1) return;
        if (opts.strict && !childValidated(child, child.parent)) {
          child.__atrulebem__ = { valid: false };
          if (opts.warn) container.warn(result, `Type ${String(child.name)} cannot have child of ${String(child.parent.name)}`);

          return;
        }

        container.append(postcss.rule({
          selector: generateSelector(child),
          nodes: child.nodes
        }));
      });

      block.replaceWith(cleanChildren(container));
    });
  };
});
