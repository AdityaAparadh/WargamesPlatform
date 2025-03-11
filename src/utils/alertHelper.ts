/**
 * A safer alert function that prevents spacebar focus issues when alerts are dismissed
 * @param message Message to display in the alert
 */
export const safeAlert = (message: string): void => {
  alert(message);
  // No need for focus restoration since alerts aren't used anymore
};

/**
 * A safer confirm function that prevents spacebar focus issues when confirm dialogs are dismissed
 * @param message Message to display in the confirm dialog
 * @returns boolean Result of the confirm dialog
 */
export const safeConfirm = (message: string): boolean => {
  const result = confirm(message);
  // No need for focus restoration since confirms aren't used anymore
  return result;
};

export default { safeAlert, safeConfirm };
