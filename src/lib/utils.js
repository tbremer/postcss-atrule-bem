import {
  ELEMENT,
  MODIFIER,
  VALID_RULES,
  VALID_CHILDREN
} from './constants';

function childValidated(child, parent) {
  return VALID_CHILDREN[parent.name].indexOf(child.name) !== -1;
}

function cleanChildren(container) {
  const clone = container.clone();

  for (const rule of clone.nodes) {
    rule.nodes.reduce((a, c) => {
      if (c.type !== 'atrule') return a;
      if (c.__atrulebem__ && !c.__atrulebem__.valid) return a;
      if (VALID_RULES.indexOf(c.name) === -1) return a;

      a.push(c);

      return a;
    }, [])
      .forEach(_ => rule.removeChild(_));
  }

  return clone;
}

function getPrefix(type) {
  switch (type) {
    case ELEMENT: return '__';
    case MODIFIER: return '--';
    default: return '.';
  }
}

function generateSelector({ name, params }) {
  const prefix = getPrefix(name);

  return params.split(',').reduce((all, curr) => [].concat(all, `${prefix}${curr.trim()}`), []);
}

function prependAonB(a, b) {
  const MERGED = [];
  const aL = a.length;
  const bL = b.length;
  let aC = 0;

  for (; aC < aL; aC++) {
    const aCurr = a[aC];
    let bC = 0;

    for (; bC < bL; bC++) {
      const bCurr = b[bC];

      MERGED.push(`${aCurr}${bCurr}`);
    }
  }

  return MERGED;
}

export { cleanChildren, childValidated, generateSelector, prependAonB };
