import test from 'ava';
import Command from './Command';

test('require name', t => {
  t.throws(() => new Command(), 'Expect command name to be string')
});

test('require desc', t => {
  t.throws(() => new Command('name'), 'Expect command to have a description')
});