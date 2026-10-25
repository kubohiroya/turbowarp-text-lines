import {extensionConfig} from './config.js';
import {TextLinesExtension} from './extension.js';

if (extensionConfig.unsandboxed && !Scratch.extensions.unsandboxed) {
  throw new Error(`${extensionConfig.name} must run unsandboxed to write to Scratch lists.`);
}

Scratch.extensions.register(new TextLinesExtension());
