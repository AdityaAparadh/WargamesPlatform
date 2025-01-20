import { spawn, exec } from "child_process";
import path from "path";
import { CommandResult } from "../types/CommandResult";
import ProcessError from "../types/ProcessError";

/**
 *
 * @param dirPath The path string
 * @returns Whether given directory is valid or not
 */
const isValidDirectory = (dirPath: string): boolean => {
  try {
    path.resolve(dirPath);
    return true;
  } catch {
    return false;
  }
};

/**
 *
 * @param command - The command to be executed
 * @returns Whether the string includes a banned command
 */
const isValidCommand = (command: string): boolean => {
  const blockedCommands = ["sudo", "chmod"]; // Maybe add more?
  return !blockedCommands.some((cmd) => command.includes(cmd));
};

/**
 * @todo Get PID of terminal process to maybe kill it later
 * Opens a gnome-terminal in the specified directory
 * @param directory - The directory path where the terminal should open
 * @returns promise that resolves when the terminal is opened successfully
 * @throws {ProcessError} If the directory is invalid or terminal fails to open
 */

export const openTerminal = async (directory: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isValidDirectory(directory)) {
      reject(new ProcessError("Invalid directory path"));
      return;
    }

    try {
      const terminal = spawn("gnome-terminal", [
        "--working-directory",
        directory,
      ]);

      terminal.on("error", (error: Error) => {
        reject(new ProcessError(error.message));
      });

      terminal.on("exit", (code: number | null) => {
        if (code === 0) {
          resolve("Terminal opened successfully");
        } else {
          reject(
            new ProcessError(
              `Terminal exited with code ${code}`,
              code ?? undefined,
            ),
          );
        }
      });
    } catch (error) {
      reject(
        new ProcessError(
          error instanceof Error ? error.message : "Unknown error",
        ),
      );
    }
  });
};

/**
 * Executes a shell command in the specified directory
 * @param command - The shell command to execute
 * @param workingDir - Working directory for command execution (optional)
 * @returns Promise that resolves with command output
 * @throws {ProcessError} If the command or directory is invalid or command fails
 */
export const executeCommand = async (
  command: string,
  workingDir: string = process.cwd(),
): Promise<CommandResult> => {
  return new Promise((resolve, reject) => {
    if (!isValidCommand(command)) {
      reject(new ProcessError("Invalid or blocked command"));
      return;
    }

    if (!isValidDirectory(workingDir)) {
      reject(new ProcessError("Invalid working directory"));
      return;
    }

    exec(command, { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        reject(new ProcessError(error.message, error.code));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

export type { CommandResult };
export { ProcessError };
