interface ScratchVariable {
  id: string;
  value: unknown[];
  type: string;
  name: string;
  _monitorUpToDate?: boolean;
}
interface ScratchTarget {
  variables: Record<string, ScratchVariable>;
  lookupVariableById(id: string): ScratchVariable | null;
  lookupVariableByNameAndType(name: string, type: string): ScratchVariable | null;
}
interface ScratchBlockUtility { target: ScratchTarget; }
interface ScratchTranslate {
  (text: string): string;
  (message: {default: string; description?: string}, placeholders?: Record<string, string | number>): string;
}
interface ScratchApi {
  extensions: { unsandboxed: boolean; register(extension: unknown): void };
  BlockType: Record<'COMMAND' | 'REPORTER', string>;
  ArgumentType: Record<'STRING' | 'NUMBER', string>;
  Cast: { toString(value: unknown): string; toNumber(value: unknown): number };
  translate: ScratchTranslate;
  vm: { editingTarget: ScratchTarget | null; runtime: { getTargetForStage(): ScratchTarget } };
}
declare const Scratch: ScratchApi;
