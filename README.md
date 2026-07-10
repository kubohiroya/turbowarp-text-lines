# TurboWarp Text Lines

A TurboWarp extension for counting, reading, and splitting text by lines.

## Blocks

- `[text] の行数`
- `[text] の [line] 行目`
- `[text] を行ごとのリスト [list] へ`

Line numbers are one-based. An invalid line number returns an empty string. The list block replaces the contents of the named Scratch list.

The extension accepts LF, CRLF, and CR line endings.

## Development

```bash
npm install
npm run check
```

The build produces `dist/text-lines.js`.

Because the extension writes directly to Scratch list variables, load it as an unsandboxed custom extension.

## License

MPL-2.0
