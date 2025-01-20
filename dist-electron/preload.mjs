"use strict";
const electron = require("electron");
const child_process = require("child_process");
const path = require("path");
class ProcessError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ProcessError";
  }
}
const isValidDirectory = (dirPath) => {
  try {
    path.resolve(dirPath);
    return true;
  } catch {
    return false;
  }
};
const isValidCommand = (command) => {
  const blockedCommands = ["sudo", "chmod"];
  return !blockedCommands.some((cmd) => command.includes(cmd));
};
const openTerminal = async (directory) => {
  return new Promise((resolve, reject) => {
    if (!isValidDirectory(directory)) {
      reject(new ProcessError("Invalid directory path"));
      return;
    }
    try {
      const terminal = child_process.spawn("gnome-terminal", [
        "--working-directory",
        directory
      ]);
      terminal.on("error", (error) => {
        reject(new ProcessError(error.message));
      });
      terminal.on("exit", (code) => {
        if (code === 0) {
          resolve("Terminal opened successfully");
        } else {
          reject(
            new ProcessError(
              `Terminal exited with code ${code}`,
              code ?? void 0
            )
          );
        }
      });
    } catch (error) {
      reject(
        new ProcessError(
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    }
  });
};
const executeCommand = async (command, workingDir = process.cwd()) => {
  return new Promise((resolve, reject) => {
    if (!isValidCommand(command)) {
      reject(new ProcessError("Invalid or blocked command"));
      return;
    }
    if (!isValidDirectory(workingDir)) {
      reject(new ProcessError("Invalid working directory"));
      return;
    }
    child_process.exec(command, { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        reject(new ProcessError(error.message, error.code));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("processManager", {
  openTerminal,
  executeCommand
});
