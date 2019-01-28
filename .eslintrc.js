module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  rules:{
    'vue/max-attributes-per-line':'off',
    'vue/require-prop-types':'off',
    'vue/require-v-for-key':'off',
    'vue/require-default-prop':'off',
    'comma-dangle':'off',
    'prefer-template':'error'
  },
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: ['vue'],
  globals: {
    _: true,
    Vue: true,
    moment: true
  }
}
