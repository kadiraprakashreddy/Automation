/**
 * Common alert scripts for validation notifications
 */

/**
 * Show a visible notification alert on the page
 * @param {string} message - The alert message to display
 * @param {string} type - The type of alert (error, warning, success)
 * @returns {string} - Confirmation message
 */
export function validate(message, type = 'error') {
  const colors = {
    error: '#ff4444',
    warning: '#ff8800', 
    success: '#00aa00',
    info: '#0088ff'
  };
  
  const icons = {
    error: '🚨',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️'
  };
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${colors[type] || colors.error};
    color: white;
    padding: 12px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    z-index: 99999;
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
    border: 1px solid #fff;
    text-align: center;
    min-width: 160px;
    max-width: 240px;
    word-wrap: break-word;
  `;
  
  notification.innerHTML = `${icons[type] || icons.error} ${message}`;
  document.body.appendChild(notification);
  
  // Make it flash for error and warning types
  if (type === 'error' || type === 'warning') {
    setInterval(() => {
      const currentBg = notification.style.background;
      const newBg = currentBg === colors[type] ? 
        (type === 'error' ? '#ff6666' : '#ffaa00') : 
        colors[type];
      notification.style.background = newBg;
    }, 500);
  }
  
  return 'Notification created';
}

/**
 * Show a simple browser alert
 * @param {string} message - The alert message
 * @returns {string} - Confirmation message
 */
export function showBrowserAlert(message) {
  alert(message);
  return 'Alert shown';
}

/**
 * Show a console log message
 * @param {string} message - The message to log
 * @returns {string} - Confirmation message
 */
export function showConsoleAlert(message) {
  console.log('🚨 VALIDATION ALERT:', message);
  return 'Console message logged';
}
