"use strict";

module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules":{
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }],
    "linebreak-style": "off",
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off",
    "eol-last": "off",
    "import/no-extraneous-dependencies":"off",
    "react/prefer-stateless-function":"off",
    "react/forbid-prop-types":"off",
    "react/jsx-one-expression-per-line":"off",
    "react/sort-comp":"off",
    "jsx-a11y/no-static-element-interactions":"off",
    "jsx-a11y/click-events-have-key-events":"off",
    "max-len":"off"
  },
  "globals":{
    "fetch":false,
    "FormData":false,
    "setInterval":false,
    "clearInterval":false,
    "document":false
  },
};
