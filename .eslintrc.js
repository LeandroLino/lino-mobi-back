module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true // ou mocha
  },
  extends: 'standard-with-typescript',
  overrides: [{
    files: ['**/*.test.js'],
    env: {
      jest: true
    }
  }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
  }
}
