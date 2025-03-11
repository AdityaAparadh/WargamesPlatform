import { CommandResult } from './types/CommandResult';

interface ProcessManager {
  executeCommand: (command: string) => Promise<CommandResult>;
}

declare global {
  interface Window {
    processManager: ProcessManager;
    open: (url: string, target?: string, features?: string) => Window | null;
  }
}

export {};
