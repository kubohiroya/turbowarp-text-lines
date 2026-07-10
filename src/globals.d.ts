interface ScratchVariable { value: unknown[]; type: string; name: string; }
interface ScratchTarget { lookupVariableByNameAndType(name: string, type: string): ScratchVariable | null; }
interface ScratchBlockUtility { target: ScratchTarget; }
interface ScratchApi {
  extensions: { unsandboxed: boolean; register(extension: unknown): void };
  BlockType: Record<'COMMAND' | 'REPORTER', string>;
  ArgumentType: Record<'STRING' | 'NUMBER', string>;
  Cast: { toString(value: unknown): string; toNumber(value: unknown): number };
  vm: { runtime: { getTargetForStage(): ScratchTarget } };
}
declare const Scratch: ScratchApi;
