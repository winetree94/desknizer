import type {
  IpcRenderer,
  MenuItemConstructorOptions,
  MenuItem,
} from 'electron';
import type { Extension, ExtensionItem, Widget } from './entity';

export type IpcRendererEvent = Parameters<Parameters<IpcRenderer['on']>[1]>[0];

export interface OnUserExtensionItemInsertedArgs<T> {
  item: ExtensionItem<T>;
}

export type OnUserExtensionItemUpdatedArgs<T> = {
  item: ExtensionItem<T>;
};

export type OnUserExtensionItemDeletedArgs = {
  id: string;
};

export type OnContextMenuClickedArgs<T> = {
  id: string;
  data: T;
};

export type UnSubscribe = () => void;

export interface IpcRendererOnEventListeners {
  <T>(
    event: 'context-menu-clicked',
    listener: (
      event: IpcRendererEvent,
      data: OnContextMenuClickedArgs<T>
    ) => void
  ): UnSubscribe;
  <R>(
    event: 'user-extension-item-inserted',
    listener: (
      event: IpcRendererEvent,
      item: OnUserExtensionItemInsertedArgs<R>
    ) => void
  ): UnSubscribe;
  <R>(
    event: 'user-extension-item-updated',
    listener: (
      event: IpcRendererEvent,
      item: OnUserExtensionItemUpdatedArgs<R>
    ) => void
  ): UnSubscribe;
  (
    event: 'user-extension-item-deleted',
    listener: (
      event: IpcRendererEvent,
      data: OnUserExtensionItemDeletedArgs
    ) => void
  ): UnSubscribe;
  <R>(
    event: 'user-extension-updated',
    listener: (
      event: IpcRendererEvent,
      data: OnUserExtensionItemUpdatedArgs<R>
    ) => void
  ): UnSubscribe;
}

export interface HandleOpenExtensionSettingsRequest {
  extensionId: string;
}

export interface HandleGetUserExtensionInfoRequest {
  extensionId: string;
}

export interface HandleGetUserExtensionInfoResponse<M> {
  id: string;
  meta: M;
}

export interface HandleGetUserExtensionItemsRequest {
  extensionId: string;
}

export type HandleGetUserExtensionItemsResponse<R> = ExtensionItem<R>[];

export interface HandleDeleteUserExtensionItemRequest {
  id: string;
}

export interface HandleDeleteUserExtensionItemResponse {
  id: string;
}

export interface HandleCreateUserExtensionItemRequest<R> {
  extensionId: string;
  data: R;
}

export type HandleCreateUserExtensionItemResponse<R> = ExtensionItem<R>;

export interface HandleUpdateUserExtensionItemRequest<R> {
  id: string;
  data: R;
}

export type HandleUpdateUserExtensionItemResponse<R> = ExtensionItem<R>;

export type HandleWidgetInfoRequest = void;

export type HandleWidgetInfoResponse<T> = Widget<T>;

export interface HandleCreateWidgetRequest {
  id: string;
  pos?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
}

export type HandleCreateWidgetResponse = Omit<Widget, 'extensionItem'>;

export type HandleUpdateWidgetRequest = HandleCreateWidgetRequest;

export type HandleUpdateWidgetResponse = HandleCreateWidgetResponse;

export interface HandleDeleteWidgetRequest {
  id: string;
}

export interface HandleDeleteWidgetResponse {
  id: string;
}

export type HandleGetExtensionsResponse = Extension<unknown>[];

export interface IpcRendererInvokeEventListeners {
  (
    event: 'open-extension-settings',
    args: HandleOpenExtensionSettingsRequest
  ): Promise<void>;
  <M>(
    event: 'get-user-extension-info',
    args: HandleGetUserExtensionInfoRequest
  ): Promise<HandleGetUserExtensionInfoResponse<M>>;
  <R>(
    event: 'get-user-extension-items',
    args: HandleGetUserExtensionItemsRequest
  ): Promise<HandleGetUserExtensionItemsResponse<R>>;
  (
    event: 'delete-user-extension-item',
    args: HandleDeleteUserExtensionItemRequest
  ): Promise<HandleDeleteUserExtensionItemResponse>;
  <R>(
    event: 'create-user-extension-item',
    args: HandleCreateUserExtensionItemRequest<R>
  ): Promise<HandleCreateUserExtensionItemResponse<R>>;
  <R>(
    event: 'update-user-extension-item',
    args: HandleUpdateUserExtensionItemRequest<R>
  ): Promise<HandleUpdateUserExtensionItemResponse<R>>;
  <T>(
    event: 'get-widget-info',
    args: void
  ): Promise<HandleWidgetInfoResponse<T>>;
  (
    event: 'create-widget',
    args: HandleCreateWidgetRequest
  ): Promise<HandleCreateWidgetResponse>;
  (
    event: 'update-widget',
    args: HandleUpdateWidgetRequest
  ): Promise<HandleUpdateWidgetResponse>;
  (
    event: 'delete-widget',
    args: HandleDeleteWidgetRequest
  ): Promise<HandleDeleteWidgetResponse>;
  (event: 'get-extensions'): Promise<HandleGetExtensionsResponse>;
}

export interface ShowContextMenuRequest<T> {
  items: Array<
    MenuItemConstructorOptions & {
      data: T;
    }
  >;
}

export interface IpcSendEventListeners {
  <T>(event: 'show-context-menu', args: ShowContextMenuRequest<T>);
}
