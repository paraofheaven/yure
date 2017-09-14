import table from 'text-table'
import stringWidth from 'string-width'
import YureError from './YureError'

export function parseType(type) {
  if (typeof type === 'string' || type instanceof String) {
    return type
  }
  if (type === Boolean) {
    return 'boolean'
  }
}

export function orderByNamelength(nameArray) {
  return nameArray.sort((a, b) => {
    return a.length > b.length
  })
}

export function confirmParam(exp, message) {
  if (!exp) {
    throw new YureError(message);
  }
}

export function isExplictCommand(name) {
  return name && !name.startsWith('-');
}

export function textTable(data) {
  return table(data, {
    stringLength: stringWidth
  })
}

export function prefixOption(name) {
  return name.length === 1 ? `-${name}` : `--${name}`;
}

export function explictEpiLog(log) {
  if (typeof log === 'string' || log instanceof String) {
    return log;
  } else if (log.toString) {
    return log.toString();
  } else {
    throw new YureError('epiLog should be a string or has toString method');
  }
}