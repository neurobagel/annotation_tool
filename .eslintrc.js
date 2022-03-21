// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    // "airbnb", // TODO: activate this styleset
    "eslint:recommended",
    "plugin:vue/strongly-recommended",
    // "plugin:prettier/recommended", // TODO: consider activating
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {},
  globals: {
    $nuxt: true,
  },
};
