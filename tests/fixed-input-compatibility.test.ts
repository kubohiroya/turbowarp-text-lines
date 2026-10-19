import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {TextLinesExtension} from '../src/extension.js';
import {fixedInputEditors} from '../src/fixed-input-editors.js';
import baseline from './fixtures/stage3-fixed-getinfo.json' with {type: 'json'};
const translate = (message: string | {default: string}) => typeof message === 'string' ? message : message.default;
beforeEach(() => vi.stubGlobal('Scratch', {
  translate, Cast: {toString: (v: unknown) => String(v), toNumber: (v: unknown) => Number(v), toBoolean: (v: unknown) => Boolean(v)},
  BlockType: {COMMAND: 'command', REPORTER: 'reporter', BOOLEAN: 'Boolean', HAT: 'hat'},
  ArgumentType: {STRING: 'string', NUMBER: 'number', BOOLEAN: 'Boolean'},
  vm: {runtime: {on: vi.fn(), off: vi.fn()}}
}));
afterEach(() => vi.unstubAllGlobals());
it('retains the exact baseline getInfo with the legacy host capability', () => {
  const owner = new TextLinesExtension();
  expect(owner.getInfo()).toEqual(baseline.find(s => s.id === 'native-default')!.getInfo);
  void owner.dispose();
});
it('registers only the real visible opcodes once and disposes its own registrations', () => {
  const cleanup = vi.fn();const register = vi.fn(() => cleanup);
  (globalThis as unknown as {Scratch: {gui: unknown}}).Scratch.gui = {blockEditors: {apiVersion: 1, registerFixedInputEditor: register}};
  const owner = new TextLinesExtension();
  const info = owner.getInfo();owner.getInfo();
  const expected = baseline.find(s => s.id === "native-default")!.getInfo;
  expect(info).toEqual(expected);
  expect(register).toHaveBeenCalledTimes(fixedInputEditors.length);
  const visible = ((info as {id: string; blocks: {opcode?: string}[]}).blocks).flatMap(b => b.opcode ? [`${(info as {id: string}).id}_${b.opcode}`] : []);
  for (const [options] of register.mock.calls as unknown as [{opcodes: string[]}][]) expect(options.opcodes.every(op => visible.includes(op))).toBe(true);
  void owner.dispose();void owner.dispose();expect(cleanup).toHaveBeenCalledTimes(fixedInputEditors.length);
});
it('preserves line truncation and out-of-range empty results', () => {
  const owner = new TextLinesExtension();
  for (const [raw, expected] of [['1.9', 'a'], ['2.5', 'b'], ['-0.5', ''], ['0', ''], ['99', ''], ['0x2', 'b']] as const) expect(owner.lineAt({LINE: raw, TEXT: 'a\nb'})).toBe(expected);
});

it('retains construction before Scratch is installed', () => {
  vi.unstubAllGlobals();expect(() => new TextLinesExtension()).not.toThrow();
});
