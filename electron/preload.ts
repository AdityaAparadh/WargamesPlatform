import { ipcRenderer, contextBridge } from "electron";
import {
  openTerminal,
  executeCommand,
  type CommandResult,
} from "../node/Terminal";
// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

contextBridge.exposeInMainWorld("processManager", {
  openTerminal,
  executeCommand,
});

declare global {
  interface Window {
    processManager: {
      openTerminal: (directory: string) => Promise<string>;
      executeCommand: (
        command: string,
        workingDir?: string,
      ) => Promise<CommandResult>;
    };
  }
}
