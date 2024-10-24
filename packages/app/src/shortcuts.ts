import { BrowserWindow, globalShortcut } from 'electron';
import { platformSwitch } from './platform';

export async function loadShortcuts() {
  const showKeyRegistration = globalShortcut.register(
    'CommandOrControl+Alt+Shift+X',
    async () => {
      await platformSwitch({
        win32: async () => {
          const windows = BrowserWindow.getAllWindows();
          windows.forEach((window) => {
            window.setSkipTaskbar(true);
            window.hide();
          });
          windows.forEach((window) => {
            window.show();
          });
          windows.forEach((window) => {
            window.setSkipTaskbar(false);
            window.focus();
          });
        },
        default: async () => {
          const windows = BrowserWindow.getAllWindows();
          windows.forEach((window) => {
            window.setAlwaysOnTop(true);
            window.setVisibleOnAllWorkspaces(true);
          });
          await new Promise((resolve) => setTimeout(resolve, 500));
          windows.forEach((window) => {
            window.setAlwaysOnTop(false);
            window.setVisibleOnAllWorkspaces(false);
            window.focus();
          });
        },
      })();
    }
  );
  if (!showKeyRegistration) {
    console.error('registration failed');
  }

  const hideKeyRegistration = globalShortcut.register(
    'CommandOrControl+Alt+Shift+C',
    async () => {
      // const windows = BrowserWindow.getAllWindows();
      // windows.forEach((window) => {
      // window.hide();
      // window.setSkipTaskbar(false);
      // window.show();
      // window.setAlwaysOnTop(false);
      // });
    }
  );
  if (!hideKeyRegistration) {
    console.error('registration failed');
  }
}
