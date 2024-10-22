import { ipcMain, IpcMainInvokeEvent, IpcMainEvent } from 'electron';
import {
  HandleCreateUserExtensionItemRequest,
  HandleCreateUserExtensionItemResponse,
  HandleGetUserExtensionItemsRequest,
  HandleGetUserExtensionItemsResponse,
  HandleCreateWidgetRequest,
  HandleCreateWidgetResponse,
  HandleGetUserExtensionInfoRequest,
  HandleGetUserExtensionInfoResponse,
  HandleOpenExtensionSettingsRequest,
  HandleGetExtensionsResponse,
  HandleDeleteWidgetRequest,
  HandleDeleteWidgetResponse,
  HandleUpdateWidgetRequest,
  HandleUpdateWidgetResponse,
  HandleDeleteUserExtensionItemRequest,
  HandleDeleteUserExtensionItemResponse,
  OnUserExtensionItemInsertedArgs,
  OnUserExtensionItemUpdatedArgs,
  OnUserExtensionItemDeletedArgs,
  HandleWidgetInfoRequest,
  HandleWidgetInfoResponse,
  HandleUpdateUserExtensionItemRequest,
  HandleUpdateUserExtensionItemResponse,
  ShowContextMenuRequest,
  OnWindowFocusChangeArgs,
  HandleIsWindowFocusedResponse,
} from '@note/types/ipc';

interface IpcHandlers {
  /**
   * @description
   * 사용 가능한 익스텐션 목록을 반환
   */
  'get-extensions': {
    request: void;
    response: HandleGetExtensionsResponse;
  };
  /**
   * @description
   * 사용자의 익스텐션 설정 정보를 반환
   */
  'get-user-extension-info': {
    request: HandleGetUserExtensionInfoRequest;
    response: HandleGetUserExtensionInfoResponse<unknown>;
  };
  /**
   * @description
   * 사용자의 익스텐션 데이터 목록을 반환
   */
  'get-user-extension-items': {
    request: HandleGetUserExtensionItemsRequest;
    response: HandleGetUserExtensionItemsResponse<unknown>;
  };

  'update-user-extension-item': {
    request: HandleUpdateUserExtensionItemRequest<object>;
    response: HandleUpdateUserExtensionItemResponse<object>;
  };

  'delete-user-extension-item': {
    request: HandleDeleteUserExtensionItemRequest;
    response: HandleDeleteUserExtensionItemResponse;
  };

  /**
   * @description
   * 사용자의 익스텐션 아이템 데이터를 생성
   */
  'create-user-extension-item': {
    request: HandleCreateUserExtensionItemRequest<unknown>;
    response: HandleCreateUserExtensionItemResponse<unknown>;
  };

  'get-widget-info': {
    request: HandleWidgetInfoRequest;
    response: HandleWidgetInfoResponse<unknown>;
  };

  /**
   * @description
   * 위젯을 생성합니다.
   */
  'create-widget': {
    request: HandleCreateWidgetRequest;
    response: HandleCreateWidgetResponse;
  };

  'update-widget': {
    request: HandleUpdateWidgetRequest;
    response: HandleUpdateWidgetResponse;
  };

  'delete-widget': {
    request: HandleDeleteWidgetRequest;
    response: HandleDeleteWidgetResponse;
  };

  /**
   * @description
   * 익스텐션 설정을 엽니다.
   */
  'open-extension-settings': {
    request: HandleOpenExtensionSettingsRequest;
    response: void;
  };

  'is-window-focused': {
    request: void;
    response: HandleIsWindowFocusedResponse;
  };
}

// 각 채널에 맞는 핸들러 등록 함수
export function handleIpc<K extends keyof IpcHandlers>(
  channel: K,
  listener: (
    event: IpcMainInvokeEvent,
    args: IpcHandlers[K]['request']
  ) => IpcHandlers[K]['response'] | Promise<IpcHandlers[K]['response']>
) {
  ipcMain.handle(channel, listener);
}

interface SendEventListeners {
  'user-extension-item-inserted': {
    request: OnUserExtensionItemInsertedArgs<unknown>;
  };
  'user-extension-item-updated': {
    request: OnUserExtensionItemUpdatedArgs<unknown>;
  };
  'user-extension-item-deleted': {
    request: OnUserExtensionItemDeletedArgs;
  };
  'on-window-focus-change': {
    request: OnWindowFocusChangeArgs;
  };
}

export function sendWindow<K extends keyof SendEventListeners>(
  window: Electron.BrowserWindow,
  channel: K,
  args: SendEventListeners[K]['request']
) {
  window.webContents.send(channel, args);
}

interface OnEventListeners {
  'show-context-menu': {
    request: ShowContextMenuRequest<unknown>;
  };
}

// 각 채널에 맞는 핸들러 등록 함수
export function onIpc<K extends keyof OnEventListeners>(
  channel: K,
  listener: (event: IpcMainEvent, args: OnEventListeners[K]['request']) => void
) {
  ipcMain.on(channel, listener);
}
