import {readFile, writeFile} from 'node:fs/promises';

const START = '<!-- BEGIN GENERATED BLOCKS -->';
const END = '<!-- END GENERATED BLOCKS -->';

const definitions = JSON.parse(
  await readFile(new URL('../src/block-definitions.json', import.meta.url), 'utf8')
);
const readmeUrl = new URL('../README.md', import.meta.url);
const readme = await readFile(readmeUrl, 'utf8');

const generated = definitions.blocks.map(renderBlock).join('\n\n');
const replacement = `${START}\n\n${generated}\n\n${END}`;

if (!readme.includes(START) || !readme.includes(END)) {
  throw new Error('README.md does not contain the generated block markers.');
}

const next = readme.replace(
  new RegExp(`${escapeRegExp(START)}[\\s\\S]*?${escapeRegExp(END)}`),
  replacement
);
await writeFile(readmeUrl, next);

function renderBlock(block) {
  const rows = [
    ['Type', titleCase(block.blockType)],
    ['Opcode', `\`${block.opcode}\``]
  ];
  for (const [name, argument] of Object.entries(block.arguments ?? {})) {
    const details = [titleCase(argument.type)];
    if (argument.menu) details.push(`menu: \`${argument.menu}\``);
    if (argument.defaultValue !== undefined) {
      details.push(`default: \`${formatDefault(argument.defaultValue)}\``);
    }
    rows.push([
      `\`${name}\``,
      details.join(', ')
    ]);
  }
  return [
    `### \`${block.text}\``,
    '',
    block.description,
    '',
    '<details>',
    '<summary>Block metadata</summary>',
    '',
    '| Property | Value |',
    '|---|---|',
    ...rows.map(([name, value]) => `| ${name} | ${value} |`),
    '',
    '</details>'
  ].join('\n');
}

function titleCase(value) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatDefault(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll('`', '\\`');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
