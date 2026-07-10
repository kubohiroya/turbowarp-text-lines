import {TextLinesExtension} from './extension.js';

if (!Scratch.extensions.unsandboxed) {
  throw new Error('Text Lines must run unsandboxed to write to Scratch lists.');
}

Scratch.extensions.register(new TextLinesExtension());
