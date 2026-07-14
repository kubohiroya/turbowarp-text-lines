# TurboWarp Text Lines

A TurboWarp extension for counting, reading, and splitting text by lines.

## Installation

Download [`dist/text-lines.js`](dist/text-lines.js), then open TurboWarp Desktop and load it as a local custom extension. Enable **Run extension without sandbox** when prompted.

The built JavaScript file is committed to this repository so that users do not need to install Node.js or run the build process.

## Blocks

<!-- BEGIN GENERATED BLOCKS -->

### `number of lines in [TEXT]`

Returns the number of lines in the supplied text.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `lineCount` |
| `TEXT` | String, default: `first line\nsecond line` |

### `line [LINE] of [TEXT]`

Returns one line using a one-based line number. Invalid line numbers return an empty string.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `lineAt` |
| `TEXT` | String, default: `first line\nsecond line` |
| `LINE` | Number, default: `1` |

### `put lines of [TEXT] into list [LIST]`

Replaces the contents of the named Scratch list with the lines of the supplied text.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `writeLinesToList` |
| `TEXT` | String, default: `first line\nsecond line` |
| `LIST` | String, menu: `LIST_MENU` |

<!-- END GENERATED BLOCKS -->

Line numbers are one-based. An invalid line number returns an empty string. The list block replaces the contents of the named Scratch list.

The extension accepts LF, CRLF, and CR line endings.

## Development

```bash
npm install
npm run check
```

Regenerate the block documentation after changing `src/block-definitions.json`:

```bash
npm run docs
```

The build produces `dist/text-lines.js`. Commit the rebuilt file whenever the extension source changes.
