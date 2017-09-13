require('babel-register');

const yure = require('../scripts').default;
const cli = yure();

cli.command('*', {
  desc: 'the default command to start dev server'
}, (input, flags) => {
  if (flags.age) {
    console.log(`${input[0]} is ${flags.age} years old`)
  }
}).option('age', {
  type: 'string',
  desc: 'tell me your age'
});

cli.parse();