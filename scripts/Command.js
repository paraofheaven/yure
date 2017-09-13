import Option from './Option'
import { confirmParam, orderByNamelength } from './utils'

export default class Command {
  constructor(name, opt, handler) {
    opt = opt || {};
    if (typeof opt === 'string' || opt instanceof String) {
      opt = { desc: opt };
    }
    confirmParam(typeof name === 'string', 'Expect command name to be string');
    confirmParam(opt.desc, 'Expect command to have a description');

    const command = {
      ...opt,
      name,
      alias: opt.alias || [],
      desc: opt.desc
    };

    command.names = orderByNamelength([command.name].concat(command.alias));
    this.command = command;
    this.options = new Option();
    this.handler = handler;
  }

  option(...args) {
    this.options.add(...args);
    return this;
  }
}