import {fixedInputRegistration} from './fixed-input-editors.js';
import definitions from './block-definitions.json' with {type: 'json'};

type BlockTypeName = 'COMMAND' | 'REPORTER';
type ArgumentTypeName = 'STRING' | 'NUMBER';

interface DefinitionArgument {
  type: ArgumentTypeName;
  defaultValue?: string | number;
  menu?: string;
}

interface BlockDefinition {
  opcode: string;
  blockType: BlockTypeName;
  text: string;
  description: string;
  arguments: Record<string, DefinitionArgument>;
}

export const BLOCK_ICON_URI = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="#4C97FF"><circle cx="11" cy="16" r="2.6"/><circle cx="11" cy="24" r="2.6"/><circle cx="11" cy="32" r="2.6"/></g><path d="M19 16h20M19 24h20M19 32h13" fill="none" stroke="#59C059" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
)}`;

const blockDefinitions = definitions.blocks as readonly BlockDefinition[];

export class TextLinesExtension {
  private readonly fixedInputs = fixedInputRegistration(typeof Scratch === 'undefined' ? undefined : Scratch);

  public dispose(): void {this.fixedInputs.dispose();}

  getInfo() {
    this.fixedInputs.ensure(blockDefinitions.map(block => `kubohiroyatextlines_${block.opcode}`));
    const translate = Scratch.translate;
    return {
      id: 'kubohiroyatextlines',
      name: translate(definitions.extensionName),
      docsURI: 'https://kubohiroya.github.io/turbowarp-text-lines/',
      blockIconURI: BLOCK_ICON_URI,
      color1: '#5B80A5',
      blocks: blockDefinitions.map((block) => this.toScratchBlock(block)),
      menus: {
        LIST_MENU: {
          acceptReporters: true,
          items: 'getLists'
        }
      }
    };
  }

  getLists(): Array<string | {text: string; value: string}> {
    const stage = Scratch.vm.runtime.getTargetForStage();
    const editingTarget = Scratch.vm.editingTarget;
    const lists = [
      ...(stage ? Object.values(stage.variables) : []),
      ...(editingTarget && editingTarget !== stage ? Object.values(editingTarget.variables) : [])
    ].filter((variable) => variable.type === 'list');

    if (lists.length === 0) return [''];
    return lists.map((list) => ({text: list.name, value: list.id}));
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
    const listIdOrName = Scratch.Cast.toString(args.LIST);
    const stage = Scratch.vm.runtime.getTargetForStage();
    const variable =
      util.target.lookupVariableById(listIdOrName) ??
      stage?.lookupVariableById(listIdOrName) ??
      util.target.lookupVariableByNameAndType(listIdOrName, 'list') ??
      stage?.lookupVariableByNameAndType(listIdOrName, 'list');
    if (!variable || variable.type !== 'list') throw new Error(`List not found: ${listIdOrName}`);
    variable.value = splitLines(Scratch.Cast.toString(args.TEXT));
    variable._monitorUpToDate = false;
  }

  private toScratchBlock(block: BlockDefinition): Record<string, unknown> {
    return {
      opcode: block.opcode,
      blockType: Scratch.BlockType[block.blockType],
      text: Scratch.translate(block.text),
      arguments: Object.fromEntries(
        Object.entries(block.arguments).map(([name, argument]) => [
          name,
          Object.fromEntries(
            Object.entries({
              type: Scratch.ArgumentType[argument.type],
              defaultValue: argument.defaultValue,
              menu: argument.menu
            }).filter(([, value]) => value !== undefined)
          )
        ])
      )
    };
  }
}

export function splitLines(text: string): string[] {
  return text.split(/\r\n|\n|\r/);
}
