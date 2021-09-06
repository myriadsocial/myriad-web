module.exports = {
  root: true, // Make sure eslint picks up the config at the root of the directory
  parserOptions: {
    ecmaVersion: 2020, // Use the latest ecmascript standard
    sourceType: "module", // Allows using import/export statements
    ecmaFeatures: {
      jsx: true, // Enable JSX since we're using React
    },
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the react version
    },
  },
  env: {
    browser: true, // Enables browser globals like window and document
    amd: true, // Enables require() and define() as global variables as per the amd spec.
    node: true, // Enables Node.js global variables and Node.js scoping.
    jest: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended", // Make this the last element so prettier config overrides other formatting rules
  ],
  ignorePatterns: ["**/public/*.js", "**/plugins/*.js"],
  rules: {
    "no-useless-escape": ["warn"],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": ["warn"],
    "@typescript-eslint/no-empty-interface": ["warn"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { vars: "local", args: "none" },
    ],
    "jsx-a11y/click-events-have-key-events": ["warn"],
    "jsx-a11y/interactive-supports-focus": ["warn"],
    "jsx-a11y/no-static-element-interactions": ["warn"],
    "jsx-a11y/no-noninteractive-element-interactions": ["warn"],
    "react/prop-types": ["off"],
    "react/display-name": ["warn"],
    "react/no-unescaped-entities": ["warn"],
    "prettier/prettier": ["error", {}, { usePrettierrc: true }], // Use our .prettierrc file as source
  },
  plugins: ["import"],
};
