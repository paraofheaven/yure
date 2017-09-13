import Option from './Option'
import { confirmParam, orderByNamelength } from './utils'

export default class Command {
  constructor(name, opt, handler) {
    option = option || {};
    if (typeof opt === 'string' || opt instanceof String) {
      option = { desc: opt };
    }
    confirmParam(typeof name === 'string', 'Expect command name to be string');
    confirmParam(option.desc || opt.desc, 'Expect command to have a description');

    const command = {
      ...opt,
      name,
      alias: opt.alias || {},
      desc: opt.desc
    };

    command.names = orderByNamelength([opt.name].concat(opt.alias));
    this.command = command;
    this.options = new Option();
    this.handler = handler;
  }

  option(...args) {
    this.options.add(...args);
    return this;
  }
}