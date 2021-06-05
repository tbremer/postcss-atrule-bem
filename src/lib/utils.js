function childValidated(child, parent, VALID_CHILDREN) {
  return VALID_CHILDREN[parent.name].indexOf(child.name) !== -1;
}

function cleanChildren(container, VALID_RULES) {
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

function getPrefix(type, ELEMENT, MODIFIER, OPTIONS) {
  switch (type) {
    case ELEMENT: return OPTIONS.separators.element;
    case MODIFIER: return OPTIONS.separators.modifier;
    default: return '.';
  }
}

function generateSelector({ name, parent, params }, ELEMENT, MODIFIER, OPTIONS, BLOCK_SELECTOR) {
  let prefix = getPrefix(name, ELEMENT, MODIFIER, OPTIONS);

  /* If using an element inside a modifier, apply the modifier to the block selector. */
  if (name === 'e' && parent && parent.name === 'm') {
    prefix = ` ${BLOCK_SELECTOR[0]}${prefix}`;
  }

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
