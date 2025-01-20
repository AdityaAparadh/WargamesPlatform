import { CommandResult } from "../../types/CommandResult";

/**
 * Calls executeCommand over contextBridge. Use this function to setup level directories
 * @param command - The shell command to run
 * @returns {Promise<CommandResult} - Returns a promise for an object containing output to stdout and stderr as strings
 */

const runCommand = (command: string): Promise<CommandResult> => {
  return window.processManager.executeCommand(command);
};

export default runCommand;
