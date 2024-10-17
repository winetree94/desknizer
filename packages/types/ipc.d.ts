import type { IpcRenderer } from 'electron';
import type { Extension, ExtensionItem } from './entity';

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

export interface IpcRendererOnEventListeners {
  <R>(
    event: 'user-extension-item-inserted',
    listener: (
      event: IpcRendererEvent,
      item: OnUserExtensionItemInsertedArgs<R>
    ) => void
  ): void;
  <R>(
    event: 'user-extension-updated',
    listener: (
      event: IpcRendererEvent,
      data: OnUserExtensionItemUpdatedArgs<R>
    ) => void
  ): void;
  (
    event: 'user-extension-item-deleted',
    listener: (
      event: IpcRendererEvent,
      data: OnUserExtensionItemDeletedArgs
    ) => void
  ): void;
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

export interface HandleCreateWidgetResponse {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

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
