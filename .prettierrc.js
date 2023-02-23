module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  jsxBracketSameLine: true,
  arrowParens: 'avoid',
  importOrder: [
    '^(react)([-a-zA-Z]+)?$',
    '^(next)([-a-zA-Z/]+)?$',
    '^@material-ui/(.*)$',
    '^@polkadot/(.*)$',
    '^[./]',
    '^[-a-zA-Z/]+',
  ],
  importOrderSeparation: true,
};
