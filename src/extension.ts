import definitions from './block-definitions.json' with {type: 'json'};

type BlockTypeName = 'COMMAND' | 'REPORTER';
type ArgumentTypeName = 'STRING' | 'NUMBER';

interface DefinitionArgument {
  type: ArgumentTypeName;
  defaultValue: string | number;
}

interface BlockDefinition {
  opcode: string;
  blockType: BlockTypeName;
  text: string;
  description: string;
  arguments: Record<string, DefinitionArgument>;
}

const blockDefinitions = definitions.blocks as readonly BlockDefinition[];

export class TextLinesExtension {
  getInfo() {
    const translate = Scratch.translate;
    return {
      id: 'kubohiroyatextlines',
      name: translate(definitions.extensionName),
      color1: '#5B80A5',
      blocks: blockDefinitions.map((block) => this.toScratchBlock(block))
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

  private toScratchBlock(block: BlockDefinition): Record<string, unknown> {
    return {
      opcode: block.opcode,
      blockType: Scratch.BlockType[block.blockType],
      text: Scratch.translate(block.text),
      arguments: Object.fromEntries(
        Object.entries(block.arguments).map(([name, argument]) => [
          name,
          {
            type: Scratch.ArgumentType[argument.type],
            defaultValue: argument.defaultValue
          }
        ])
      )
    };
  }
}

export function splitLines(text: string): string[] {
  return text.split(/\r\n|\n|\r/);
}
