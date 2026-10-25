export const extensionConfig = {
  id: 'kubohiroyatextlines',
  slug: 'text-lines',
  name: 'Text Lines',
  description: 'Count, read, and split text by lines in TurboWarp.',
  author: 'Hiroya Kubo',
  license: 'MPL-2.0',
  unsandboxed: true,
  docsURI: 'https://kubohiroya.github.io/turbowarp-text-lines/',
  color1: '#5B80A5',
  blockIconURI: `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="#4C97FF"><circle cx="11" cy="16" r="2.6"/><circle cx="11" cy="24" r="2.6"/><circle cx="11" cy="32" r="2.6"/></g><path d="M19 16h20M19 24h20M19 32h13" fill="none" stroke="#59C059" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  )}`
} as const;
