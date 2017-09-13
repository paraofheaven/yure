require('babel-register');
const yure = require('../scripts').default;

const cli = yure();

cli.command('*', {
  desc: 'default command'
}, (input, flags) => {
  throw new Error('damn operation')
})

cli.command('p', {
  desc: 'p command'
}, (input, flags) => {
  Promise.reject(new Error('Promise reject'))
})

cli.parse();