/**
 * Calls openTerminal over contextBridge. Use this function to open a new terminal
 * @param path - The initial working directory for the terminal. You should set this to the a level directory for the participant.
 */
const createTerminal = (path: string) => {
  window.processManager.openTerminal(path);
};

export default createTerminal;
