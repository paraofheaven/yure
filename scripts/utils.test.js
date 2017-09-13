import test from 'ava';
import { parseType, orderByNamelength } from './utils';

test('parse type', t => {
  const type = parseType(Boolean);
  t.is(type, 'boolean');
})

test('parse type', t => {
  const string = 'byte';
  const type = parseType(string);
  t.is(type, 'byte');
})

test('order by name length', t => {
  let nameArray = ['aaa', 'bbbbb', 'cccc', 'd', 'ee'];
  const result = orderByNamelength(nameArray);
  t.deepEqual(result, ['d', 'ee', 'aaa', 'cccc', 'bbbbb']);
})

