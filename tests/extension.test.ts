import {beforeEach, describe, expect, it, vi} from 'vitest';
import {TextLinesExtension, splitLines} from '../src/extension.js';

beforeEach(() => {
  vi.stubGlobal('Scratch', {
    Cast: {
      toString: (value: unknown) => String(value ?? ''),
      toNumber: (value: unknown) => Number(value)
    }
  });
});

describe('splitLines', () => {
  it('supports LF, CRLF, and CR', () => {
    expect(splitLines('a\nb\r\nc\rd')).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('TextLinesExtension', () => {
  it('counts lines', () => {
    const extension = new TextLinesExtension();
    expect(extension.lineCount({TEXT: 'a\nb'})).toBe(2);
  });

  it('returns a one-based line', () => {
    const extension = new TextLinesExtension();
    expect(extension.lineAt({TEXT: 'a\nb', LINE: 2})).toBe('b');
    expect(extension.lineAt({TEXT: 'a\nb', LINE: 3})).toBe('');
  });

  it('replaces a Scratch list with lines', () => {
    const extension = new TextLinesExtension();
    const list = {name: 'lines', type: 'list', value: [] as unknown[]};
    const target = {
      lookupVariableByNameAndType: (name: string, type: string) =>
        name === 'lines' && type === 'list' ? list : null
    };
    vi.stubGlobal('Scratch', {
      Cast: {
        toString: (value: unknown) => String(value ?? ''),
        toNumber: (value: unknown) => Number(value)
      },
      vm: {runtime: {getTargetForStage: () => target}}
    });
    extension.writeLinesToList({TEXT: 'a\nb', LIST: 'lines'}, {target});
    expect(list.value).toEqual(['a', 'b']);
  });
});
