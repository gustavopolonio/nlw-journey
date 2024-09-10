module.exports = {
  root: true,
  env: { 
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'airbnb'
  ],
  settings: {
    "import/resolver": {
      typescript: true
    }
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'import/prefer-default-export': 'off',
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'react/react-in-jsx-scope': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'ts': 'never',
        'tsx': 'never'
      }
    ],
    "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
    'react/jsx-no-bind': ['error', {
      allowArrowFunctions: true,
      allowFunctions: true,
    }],
    "@typescript-eslint/no-unused-vars": "error",
    "react/jsx-props-no-spreading": ["error", {
      "html": "ignore",
    }],
    "react/require-default-props": ["error", {
      "forbidDefaultForRequired": true,
      "functions": "defaultArguments"
    }]
  }
}
