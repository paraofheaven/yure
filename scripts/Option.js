import chalk from 'chalk'
import { parseType, orderByNamelength, textTable, prefixOption } from './utils'

export default class Option {
  constructor() {
    this.options = [];
  }
  add(name, opt) {
    opt = opt || {};
    if (typeof opt === 'string') {
      opt = { desc: opt }
    }
    const option = {
      ...opt,
      name,
      alias: opt.alias || [],
      desc: opt.desc,
      default: opt.default,
      type: parseType(opt.type)
    };
    option.names = orderByNamelength([option.name].concat(option.alias));
    this.options.push(option);
    return this;
  }

  getOptionByType(type) {
    return this.options.filter((option) => option.type === type);
  }

  getOptionNamesByType(type) {
    return this.getOptionByType(type).map(option => option.name)
  }

  getDefaultsMapping() {
    return this.options.filter((option) => {
      return typeof option.default !== 'undefined'
    }).reduce((res, next) => {
      res[next.name] = next.default;
      return res;
    }, {})
  }

  getAliasMap() {
    return this.options.reduce((res, next) => {
      res[next.name] = next.alias;
      return res;
    }, {})
  }

  isEmpty() {
    return this.options.length === 0;
  }

  toString() {
    return textTable(
      this.options.map(option => {
        const extra = [];
        if (typeof option.default !== 'undefined') {
          extra.push(`Default: ${JSON.stringify(option.default)}`)
        }
        if (typeof option.type === 'string') {
          extra.push(`Type: ${option.type}`)
        }
        return [
          option.names.map(v => chalk.yellow(prefixOption(v))).join(', '),
          chalk.dim(option.desc),
          extra.map((v) => `[${v}]`).join(' ')
        ]
      })
    )
  }
}