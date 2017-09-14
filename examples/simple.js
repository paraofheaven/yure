require('babel-register');

const yure = require('../scripts').default;
const chalk = require('chalk');
const cli = yure();

cli.epilog(`${chalk.cyan.bold('Copyright')} 2017 author @tianyingchun`);

cli.command('*', {
  desc: 'the default command to start dev server'
}, (input, flags) => {
  if (flags.age) {
    console.log(`${input[0]} is ${flags.age} years old`)
  }
}).option('age', {
  type: 'string',
  alias: 'a',
  desc: 'tell me your age'
});

cli.parse();