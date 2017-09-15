import path from 'path'
import EventEmitter from 'events'
import readPkg from 'read-pkg-up'
import chalk from 'chalk'
import minimost from './minimost'
import Option from './Option'
import Command from './Command'
import Help from './Help'
import { isExplictCommand, textTable, explictEpiLog } from './utils'

// prevent caching of this module so module.parent is always accurate

delete require.cache[__filename];
const parentDir = path.dirname(module.parent.filename);

export default class Yure extends EventEmitter {
  constructor({ bin, pkg } = {}) {
    super();
    this.bin = bin || path.basename(process.argv[1]);
    this.commands = [];
    this.options = new Option();

    this.pkg = Object.assign({},
      pkg || readPkg.sync({ cwd: parentDir, normalize: false }).pkg
    );

    // add global options like version as -v and help as -h
    this.option('version', {
      alias: 'v',
      type: 'boolean',
      desc: 'show display version'
    }).option('help', {
      alias: 'h',
      type: 'boolean',
      desc: 'show help'
    });

  }
  option(...args) {
    this.options.add(...args);
    return this;
  }

  command(...args) {
    const command = new Command(...args);
    this.commands.push(command);
    return command;
  }

  findCommandByNameOrAlias(name) {
    return this.commands.filter(({ command }) => {
      return command.names.indexOf(name) > -1
    })[0]
  }

  isCommandsEmpty() {
    return this.commands.length === 0;
  }

  getCommand(name) {
    // No Expect command ,use default command
    if (!isExplictCommand(name)) {
      return {
        command: this.findCommandByNameOrAlias('*'),
        sliceFirstArg: false
      }
    }
    const command = this.findCommandByNameOrAlias(name);
    if (command) {
      return {
        command,
        sliceFirstArg: true
      }
    }
    return {
      command: this.findCommandByNameOrAlias('*'),
      sliceFirstArg: false
    }
  }

  commandsToString() {
    return textTable(
      this.commands.map(({ command }) => {
        return [
          command.names.map(v => chalk.magenta(v)).join(', '),
          chalk.dim(command.desc)
        ]
      })
    )
  }

  showHelp() {
    if (!this.startStatus) {
      throw new Error('[yure] you have to call parse() before running showHelp()')
    }

    const displayCommands = !isExplictCommand(this.firstArg);
    const epilog = explictEpiLog(this.epilog);
    const help = new Help(this, this.matchedCommand, { displayCommands, epilog });
    help.output();
    return this;
  }

  showVersion() {
    console.log(chalk.dim(this.pkg.version));
    return this;
  }

  epilog(str) {
    this.epilog = str;
  }

  parse(argv, { run = true } = {}) {
    // parse the command line interface
    this.startStatus = true;
    argv = argv || process.argv.slice(2);
    this.firstArg = argv[0];
    const { command, sliceFirstArg } = this.getCommand(this.firstArg);
    this.matchedCommand = command;

    let { input, flags } = minimost(argv, {
      boolean: [
        ...this.options.getOptionNamesByType('boolean'),
        ...(command ? command.options.getOptionNamesByType('boolean') : [])
      ],
      string: [
        ...this.options.getOptionNamesByType('string'),
        ...(command ? command.options.getOptionNamesByType('string') : [])
      ],
      default: {
        ...this.options.getDefaultsMapping(),
        ...(command ? command.options.getDefaultsMapping() : {})
      },
      alias: {
        ...this.options.getAliasMap(),
        ...(command ? command.options.getAliasMap() : {})
      }
    });

    input = sliceFirstArg ? input.slice(1) : input;
    
    // emit parsed hook
    this.emit('parsed', command, input, flags);

    if (!run) {
      return { input, flags }
    }
    if (flags.help) {
      this.showHelp();
    } else if (flags.version) {
      this.showVersion();
    } else if (command && command.handler) {
      try {
        const res = command.handler(input, flags);
        if (res && res.catch) {
          res.catch(err => this.handleError(err));
        }
      } catch (err) {
        this.handleError(err)
      }
    }
  }

  handleError(err) {
    if (EventEmitter.listenerCount('error') === 0) {
      console.error(err);
      process.exitCode = process.exitCode || 1;
    } else {
      this.emit('error', err);
    }
  }

}