import { app, BrowserWindow } from 'electron';
import { handleIpc } from './ipc-main';

let isQuitting = false;

app.on('before-quit', () => {
  isQuitting = true;
});

// 함수 타입을 제네릭으로 받는 HOC 선언
export function whenNotQuitting<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> | void {
  return function (...args: Parameters<T>): ReturnType<T> | void {
    if (isQuitting) {
      return;
    }
    return fn(...args);
  };
}

handleIpc('is-window-focused', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  return Promise.resolve({
    focused: !!window?.isFocused(),
  });
});
