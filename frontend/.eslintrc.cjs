module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'airbnb'
  ],
  settings: {
    "import/extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx"
    ]
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'import/prefer-default-export': [
      'off'
    ],
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'react/react-in-jsx-scope': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'tsx': 'never'
      }
    ],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".tsx"] }],
    "react/jsx-no-bind": ["off"],
    "@typescript-eslint/no-unused-vars": [
      2,
      {
        "args": "after-used"
      }
    ],
    "jsx-a11y/control-has-associated-label": "off",
    "react/jsx-props-no-spreading": ["off", {
      "html": "ignore" | "enforce",
      "custom": "ignore" | "enforce",
      "explicitSpread": "ignore" | "enforce"
    }]
  },
}
