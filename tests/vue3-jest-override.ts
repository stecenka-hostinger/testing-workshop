// https://github.com/vuejs/core/issues/8301#issuecomment-1545778035 - This is because of Vue 3.3.4 update
// evan vue message
require('@vue/compiler-sfc').registerTS(() => require('typescript'));
module.exports = require('@vue/vue3-jest');
