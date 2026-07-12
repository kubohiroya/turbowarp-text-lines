// Name: Text Lines
// ID: kubohiroyatextlines
// Description: Count, read, and split text by lines in TurboWarp.
// By: Hiroya Kubo
// License: MPL-2.0

(function (Scratch) {
  'use strict';

  const extensionName = "Text Lines";
  const blocks = [{ "opcode": "lineCount", "blockType": "REPORTER", "text": "number of lines in [TEXT]", "description": "Returns the number of lines in the supplied text.", "arguments": { "TEXT": { "type": "STRING", "defaultValue": "first line\nsecond line" } } }, { "opcode": "lineAt", "blockType": "REPORTER", "text": "line [LINE] of [TEXT]", "description": "Returns one line using a one-based line number. Invalid line numbers return an empty string.", "arguments": { "TEXT": { "type": "STRING", "defaultValue": "first line\nsecond line" }, "LINE": { "type": "NUMBER", "defaultValue": 1 } } }, { "opcode": "writeLinesToList", "blockType": "COMMAND", "text": "put lines of [TEXT] into list [LIST]", "description": "Replaces the contents of the named Scratch list with the lines of the supplied text.", "arguments": { "TEXT": { "type": "STRING", "defaultValue": "first line\nsecond line" }, "LIST": { "type": "STRING", "defaultValue": "lines" } } }];
  const definitions = {
    extensionName,
    blocks
  };
  const blockDefinitions = definitions.blocks;
  class TextLinesExtension {
    getInfo() {
      const translate = Scratch.translate;
      return {
        id: "kubohiroyatextlines",
        name: translate(definitions.extensionName),
        color1: "#5B80A5",
        blocks: blockDefinitions.map((block) => this.toScratchBlock(block))
      };
    }
    lineCount(args) {
      return splitLines(Scratch.Cast.toString(args.TEXT)).length;
    }
    lineAt(args) {
      const lines = splitLines(Scratch.Cast.toString(args.TEXT));
      const line = Math.trunc(Scratch.Cast.toNumber(args.LINE));
      if (!Number.isFinite(line) || line < 1 || line > lines.length) return "";
      return lines[line - 1] ?? "";
    }
    writeLinesToList(args, util) {
      const name = Scratch.Cast.toString(args.LIST);
      const variable = util.target.lookupVariableByNameAndType(name, "list") ?? Scratch.vm.runtime.getTargetForStage().lookupVariableByNameAndType(name, "list");
      if (!variable) throw new Error(`List not found: ${name}`);
      variable.value = splitLines(Scratch.Cast.toString(args.TEXT));
    }
    toScratchBlock(block) {
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
  function splitLines(text) {
    return text.split(/\r\n|\n|\r/);
  }
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Text Lines must run unsandboxed to write to Scratch lists.");
  }
  Scratch.extensions.register(new TextLinesExtension());

})(Scratch);
