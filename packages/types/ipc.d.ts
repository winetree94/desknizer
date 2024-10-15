import type { IpcRenderer } from 'electron';
import type { Extension, ExtensionItem } from './entity';

export type IpcRendererEvent = Parameters<Parameters<IpcRenderer['on']>[1]>[0];

export interface OnUserExtensionItemInsertedArgs<T> {
  event: IpcRendererEvent;
  item: ExtensionItem<T>;
}

export type OnUserExtensionUpdatedArgs = unknown;

export interface IpcRendererOnEventListeners {
  <R>(
    event: 'user-extension-item-inserted',
    listener: (
      event: IpcRendererEvent,
      item: OnUserExtensionItemInsertedArgs<R>
    ) => void
  ): void;
  (
    event: 'user-extension-updated',
    listener: (
      event: IpcRendererEvent,
      data: OnUserExtensionUpdatedArgs
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

export interface HandleCreateUserExtensionItemRequest<R> {
  extensionId: string;
  data: R;
}

export type HandleCreateUserExtensionItemResponse<R> = ExtensionItem<R>;

export interface HandleCreateWidgetRequest {
  id: string;
  data: { x: number; y: number };
}

export interface HandleCreateWidgetResponse {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
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
  <R>(
    event: 'create-user-extension-item',
    args: HandleCreateUserExtensionItemRequest<R>
  ): Promise<HandleCreateUserExtensionItemResponse<R>>;
  (
    event: 'create-widget',
    args: HandleCreateWidgetRequest
  ): Promise<HandleCreateWidgetResponse>;
  (event: 'get-extensions'): Promise<HandleGetExtensionsResponse>;
}
