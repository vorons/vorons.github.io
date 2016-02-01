import lunr from './index';

// monkey patching the existing tokenizr
// this will be fixed in an upcoming release of lunr
lunr.tokenizer = function (str) {
  if (!str) return []
  if (Array.isArray(str)) return str.map(function (t) { return t.toLowerCase() })
  var str = str.replace(/^\s+/, '')
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1)
      break
    }
  }
  return str
    .split(/\s+/)
    .map(function (token) {
      return token.toLowerCase()
    })
}
