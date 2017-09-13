import table from 'text-table'
import stringWidth from 'string-width'
import YureError from './'

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
  return name && !name.startWith('-');
}

export function textTable(data) {
  return table(data, {
    stringLength: stringWidth
  })
}

export function prefixOption(name) {
  return name.length === 1 ? `-${name}` : `--${name}`;
}