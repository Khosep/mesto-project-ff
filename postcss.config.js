const autoprefixer = require('autoprefixer'); // плагин для добавления вендорных префиксов
const cssnano = require('cssnano'); // плагин для минификации CSS кода

module.exports = {
  plugins: [
    autoprefixer,
    // cssnano при подключении нужно передать объект опций
    // { preset: default } говорит о том, что нужно использовать
    // стандартные настройки минификации
    cssnano({ preset: 'default' })
  ]
};