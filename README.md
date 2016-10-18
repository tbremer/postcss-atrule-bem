atrule-bem
---
[![Travis](https://img.shields.io/travis/tbremer/postcss-atrule-bem.svg?maxAge=2592000?style=flat-square)](https://travis-ci.org/tbremer/listen-in)
[![npm](https://img.shields.io/npm/v/postcss-atrule-bem.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/listen-in)
[![npm](https://img.shields.io/npm/l/postcss-atrule-bem.svg?maxAge=2592000?style=flat-square)](https://github.com/tbremer/listen-in/blob/master/LICENSE)

_Efficiently create BEM components._

## Input / Output
### Put in:
```css
@block btn {
  background-color: var(--primary);
  border: .0625rem solid var(--primary-constrast);
  color: var(--black);

  @element icon {
    color: var(--primary-contrast-high)
  }

  @modifier transparent {
    background-color: transparent;
    border-color: transparent
  }
}
```

### Get out:
```css
.btn {
    background-color: var(--primary);
    border: .0625rem solid var(--primary-constrast);
    color: var(--black)
}
.btn__icon {
    color: var(--primary-contrast-high)
}
.btn--transparent {
    background-color: transparent;
    border-color: transparent
}
```

## Usage

Add *atrule-bem* to your build tool:

```bash
npm install --save-dev postcss-atrule-bem
```

#### Node

```js
import atRuleBem from 'postcss-atrule-bem';

atRuleBem.process(/* your css */);
```

#### PostCSS

Add *PostCSS* to your build tool:

```bash
npm install postcss --save-dev
```

Load *atrule-bem* as a PostCSS plugin:

```js
import atRuleBem from 'postcss-atrule-bem';

postcss([ atRuleBem() ])
.process(/* your css */, /* options */);
```

### Pull requests welcome.

Open for pull requests in the following areas:

- Collision dectection
  - throw a warning and don't compile when:
    - a block is created twice (name collisions)
    - a block makes reference to another block
- Strict mode (as an option)
	- disallow blocks to have blocks as children
	- disallow elements to have blocks as children
	- disallow modifiers to have blocks as children
	- disallow elements to have elements as children
	- disallow modifiers to have elements as children
	- disallow modifiers to have modifiers as children
- Warning messages (turned on by default)
	- warn when one of the previous conditions are met
- any feature I may have missed. (you decide!)
