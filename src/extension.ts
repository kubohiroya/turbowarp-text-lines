export class TextLinesExtension {
  getInfo() {
    const translate = Scratch.translate;
    return {
      id: 'kubohiroyatextlines',
      name: translate('Text Lines'),
      color1: '#5B80A5',
      blocks: [
        {
          opcode: 'lineCount',
          blockType: Scratch.BlockType.REPORTER,
          text: translate('number of lines in [TEXT]'),
          arguments: {TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: 'first line\nsecond line'}}
        },
        {
          opcode: 'lineAt',
          blockType: Scratch.BlockType.REPORTER,
          text: translate('line [LINE] of [TEXT]'),
          arguments: {
            TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: 'first line\nsecond line'},
            LINE: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}
          }
        },
        {
          opcode: 'writeLinesToList',
          blockType: Scratch.BlockType.COMMAND,
          text: translate('put lines of [TEXT] into list [LIST]'),
          arguments: {
            TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: 'first line\nsecond line'},
            LIST: {type: Scratch.ArgumentType.STRING, defaultValue: 'lines'}
          }
        }
      ]
    };
  }

  lineCount(args: {TEXT: unknown}): number {
    return splitLines(Scratch.Cast.toString(args.TEXT)).length;
  }

  lineAt(args: {TEXT: unknown; LINE: unknown}): string {
    const lines = splitLines(Scratch.Cast.toString(args.TEXT));
    const line = Math.trunc(Scratch.Cast.toNumber(args.LINE));
    if (!Number.isFinite(line) || line < 1 || line > lines.length) return '';
    return lines[line - 1] ?? '';
  }

  writeLinesToList(args: {TEXT: unknown; LIST: unknown}, util: ScratchBlockUtility): void {
    const name = Scratch.Cast.toString(args.LIST);
    const variable =
      util.target.lookupVariableByNameAndType(name, 'list') ??
      Scratch.vm.runtime.getTargetForStage().lookupVariableByNameAndType(name, 'list');
    if (!variable) throw new Error(`List not found: ${name}`);
    variable.value = splitLines(Scratch.Cast.toString(args.TEXT));
  }
}

export function splitLines(text: string): string[] {
  return text.split(/\r\n|\n|\r/);
}
