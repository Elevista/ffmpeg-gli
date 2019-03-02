module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  rules:{
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-template': 'error',
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        'singleline': 5,
        'multiline': {
          'max': 5,
          'allowFirstLine': true
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/component-name-in-template-casing': 'off'
  },
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: ['vue'],
  globals: {
    _: true,
    Vue: true,
    moment: true,
    __static:true,
  }
}
