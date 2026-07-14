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
  it('defines the list argument as a dynamic menu', () => {
    vi.stubGlobal('Scratch', {
      translate: (text: string) => text,
      BlockType: {COMMAND: 'command', REPORTER: 'reporter'},
      ArgumentType: {STRING: 'string', NUMBER: 'number'}
    });
    const extension = new TextLinesExtension();

    expect(extension.getInfo()).toMatchObject({
      blocks: [
        {},
        {},
        {arguments: {LIST: {type: 'string', menu: 'LIST_MENU'}}}
      ],
      menus: {LIST_MENU: {acceptReporters: true, items: 'getLists'}}
    });
  });

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
    const list: ScratchVariable = {
      id: 'list-id',
      name: 'lines',
      type: 'list',
      value: []
    };
    const target = {
      variables: {list},
      lookupVariableById: (id: string) => (id === 'list-id' ? list : null),
      lookupVariableByNameAndType: (name: string, type: string) =>
        name === 'lines' && type === 'list' ? list : null
    };
    vi.stubGlobal('Scratch', {
      Cast: {
        toString: (value: unknown) => String(value ?? ''),
        toNumber: (value: unknown) => Number(value)
      },
      vm: {editingTarget: target, runtime: {getTargetForStage: () => target}}
    });
    extension.writeLinesToList({TEXT: 'a\nb', LIST: 'list-id'}, {target});
    expect(list.value).toEqual(['a', 'b']);
    expect(list._monitorUpToDate).toBe(false);
  });

  it('keeps supporting list names from existing blocks', () => {
    const extension = new TextLinesExtension();
    const list = {id: 'list-id', name: 'lines', type: 'list', value: [] as unknown[]};
    const target = {
      variables: {list},
      lookupVariableById: () => null,
      lookupVariableByNameAndType: (name: string, type: string) =>
        name === 'lines' && type === 'list' ? list : null
    };
    vi.stubGlobal('Scratch', {
      Cast: {
        toString: (value: unknown) => String(value ?? ''),
        toNumber: (value: unknown) => Number(value)
      },
      vm: {editingTarget: target, runtime: {getTargetForStage: () => target}}
    });
    extension.writeLinesToList({TEXT: 'a\nb', LIST: 'lines'}, {target});
    expect(list.value).toEqual(['a', 'b']);
  });

  it('writes to the current target when the stage is unavailable', () => {
    const extension = new TextLinesExtension();
    const list = {id: 'list-id', name: 'lines', type: 'list', value: [] as unknown[]};
    const target = {
      variables: {list},
      lookupVariableById: (id: string) => (id === 'list-id' ? list : null),
      lookupVariableByNameAndType: () => null
    };
    vi.stubGlobal('Scratch', {
      Cast: {
        toString: (value: unknown) => String(value ?? ''),
        toNumber: (value: unknown) => Number(value)
      },
      vm: {editingTarget: target, runtime: {getTargetForStage: () => null}}
    });

    extension.writeLinesToList({TEXT: 'a\nb', LIST: 'list-id'}, {target});
    expect(list.value).toEqual(['a', 'b']);
  });

  it('lists stage and editing-target lists using their IDs', () => {
    const extension = new TextLinesExtension();
    const stageList = {id: 'stage-list', name: 'shared', type: 'list', value: []};
    const localList = {id: 'local-list', name: 'local', type: 'list', value: []};
    const stage = {
      variables: {stageList},
      lookupVariableById: () => null,
      lookupVariableByNameAndType: () => null
    };
    const editingTarget = {
      variables: {localList},
      lookupVariableById: () => null,
      lookupVariableByNameAndType: () => null
    };
    vi.stubGlobal('Scratch', {
      vm: {editingTarget, runtime: {getTargetForStage: () => stage}}
    });

    expect(extension.getLists()).toEqual([
      {text: 'shared', value: 'stage-list'},
      {text: 'local', value: 'local-list'}
    ]);
  });

  it('returns a safe menu fallback when no lists exist', () => {
    const extension = new TextLinesExtension();
    const stage = {
      variables: {},
      lookupVariableById: () => null,
      lookupVariableByNameAndType: () => null
    };
    vi.stubGlobal('Scratch', {
      vm: {editingTarget: stage, runtime: {getTargetForStage: () => stage}}
    });

    expect(extension.getLists()).toEqual(['']);
  });

  it('lists editing-target lists when the stage is unavailable', () => {
    const extension = new TextLinesExtension();
    const localList = {id: 'local-list', name: 'local', type: 'list', value: []};
    const editingTarget = {
      variables: {localList},
      lookupVariableById: () => null,
      lookupVariableByNameAndType: () => null
    };
    vi.stubGlobal('Scratch', {
      vm: {editingTarget, runtime: {getTargetForStage: () => null}}
    });

    expect(extension.getLists()).toEqual([{text: 'local', value: 'local-list'}]);
  });
});
