/**
 * A safer alert function that prevents spacebar focus issues when alerts are dismissed
 * @param message Message to display in the alert
 */
export const safeAlert = (message: string): void => {
  alert(message);
  
  // After alert is closed, dispatch an event to restore terminal focus
  setTimeout(() => {
    const event = new CustomEvent('restore-terminal-focus', {
      detail: { source: 'safe-alert' }
    });
    window.dispatchEvent(event);
    
    // Also try directly focusing if the global method exists
    if (typeof window !== 'undefined' && (window as any).focusTerminal) {
      (window as any).focusTerminal();
    }
  }, 100);
};

/**
 * A safer confirm function that prevents spacebar focus issues when confirm dialogs are dismissed
 * @param message Message to display in the confirm dialog
 * @returns boolean Result of the confirm dialog
 */
export const safeConfirm = (message: string): boolean => {
  const result = confirm(message);
  
  // After confirm is closed, dispatch an event to restore terminal focus
  setTimeout(() => {
    const event = new CustomEvent('restore-terminal-focus', {
      detail: { source: 'safe-confirm' }
    });
    window.dispatchEvent(event);
    
    // Also try directly focusing if the global method exists
    if (typeof window !== 'undefined' && (window as any).focusTerminal) {
      (window as any).focusTerminal();
    }
  }, 100);
  
  return result;
};

export default { safeAlert, safeConfirm };
