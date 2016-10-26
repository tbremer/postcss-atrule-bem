export const BLOCK = 'block';
export const MODIFIER = 'modifier';
export const ELEMENT = 'element';
export const VALID_RULES = [ BLOCK, ELEMENT, MODIFIER ];
export const VALID_CHILDREN = {
  [BLOCK]: [ ELEMENT, MODIFIER ],
  [ELEMENT]: [ MODIFIER ],
  [MODIFIER]: []
};
