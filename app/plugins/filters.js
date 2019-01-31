import Vue from 'vue'
import moment from 'moment'

const momentConstructor = moment().constructor

Vue.filter('RdDate', function (v, ...args) {
  const toFormat = args.shift() || 'YYYY-MM-DD'
  if (v && v.constructor === momentConstructor) return v.format(toFormat)
  return moment(v, ...args).format(toFormat)
})
Vue.filter('RdDateLocale', function (v, locale, ...args) {
  const toFormat = args.shift() || 'YYYY-MM-DD'
  if (v && v.constructor === momentConstructor) return v.clone().locale(locale).format(toFormat)
  return moment(v, ...args).locale(locale).format(toFormat)
})
