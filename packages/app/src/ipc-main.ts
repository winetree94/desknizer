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

  /**
   * @description
   * 사용자의 익스텐션 아이템 데이터를 생성
   */
  'create-user-extension-item': {
    request: HandleCreateUserExtensionItemRequest<unknown>;
    response: HandleCreateUserExtensionItemResponse<unknown>;
  };

  /**
   * @description
   * 위젯을 생성합니다.
   */
  'create-widget': {
    request: HandleCreateWidgetRequest;
    response: HandleCreateWidgetResponse;
  };

  /**
   * @description
   * 익스텐션 설정을 엽니다.
   */
  'open-extension-settings': {
    request: HandleOpenExtensionSettingsRequest;
    response: void;
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

interface IpcOnEventListeners {
  'create-widget': {
    request: {
      id: string;
    };
  };
}

// 각 채널에 맞는 핸들러 등록 함수
export function onIpc<K extends keyof IpcOnEventListeners>(
  channel: K,
  listener: (
    event: IpcMainEvent,
    args: IpcOnEventListeners[K]['request']
  ) => void
) {
  ipcMain.on(channel, listener);
}
