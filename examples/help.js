require('babel-register')
const yure = require('../scripts').default

const cli = yure()

cli.command('*', {
    desc: 'default command'
  }, (input, flags) => {
    console.log(flags)
  })
  .option('hi', {
    alias: 'hey',
    desc: 'say hi to you',
    type: 'string'
  })

cli.command('init', {
    desc: 'init the app'
  }, (input, flags) => {
    console.log(flags)
  })
  .option('force', {
    alias: 'f',
    desc: 'are you sure?'
  })
  
cli.parse();