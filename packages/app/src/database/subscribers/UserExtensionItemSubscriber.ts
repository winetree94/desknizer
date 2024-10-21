import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { UserExtensionItem } from '../entities/UserExtension';
import { ExtensionManager } from '../../extension';
import { sendWindow } from '../../ipc-main';
import { ExtensionItem } from '@note/types/entity';
import { DatabaseManager } from '../database';
import { WidgetManager } from '../../widget';
import {BrowserWindow} from "electron";

@EventSubscriber()
export class UserExtensionItemSubscriber<T extends object, I extends object>
  implements EntitySubscriberInterface<UserExtensionItem<T, I>>
{
  listenTo() {
    return UserExtensionItem;
  }

  public async afterInsert(
    event: InsertEvent<UserExtensionItem<T, I>>
  ): Promise<void> {
    const targetWindow = ExtensionManager.getOpenedExtensionWindow(
      event.entity.userExtension.id
    );
    sendWindow(targetWindow, 'user-extension-item-inserted', {
      item: event.entity,
    });
  }

  public async beforeUpdate(
    event: UpdateEvent<UserExtensionItem<T, I>>
  ): Promise<void> {
    if (!event.entity) {
      return;
    }
    const manager = DatabaseManager.get().manager;
    const foundEntity = await manager.findOne(UserExtensionItem, {
      where: {
        id: event.entity.id,
      },
      relations: {
        widget: true,
        userExtension: true,
      },
    });
    if (!foundEntity) {
      return;
    }
    const extensionWindow = ExtensionManager.getOpenedExtensionWindow(
      foundEntity.userExtension.id
    );
    if (extensionWindow) {
      sendWindow(extensionWindow, 'user-extension-item-updated', {
        item: event.entity as ExtensionItem<unknown>,
      });
    }
    if (foundEntity.widget?.id) {
      const widgetWindow = WidgetManager.openedWidgetWindows.get(
        foundEntity.widget.id
      );
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (widgetWindow && widgetWindow !== focusedWindow) {
        // sendWindow(widgetWindow, 'user-extension-item-updated', {
        //   data: event.entity.data,
        // });
      }
    }
  }

  public async beforeRemove(
    event: RemoveEvent<UserExtensionItem<T, I>>
  ): Promise<void> {
    const manager = DatabaseManager.get().manager;
    const foundEntity = await manager.findOne(UserExtensionItem, {
      where: {
        id: event.entityId,
      },
      relations: {
        userExtension: true,
      },
    });
    if (!foundEntity) {
      return;
    }
    const targetWindow = ExtensionManager.getOpenedExtensionWindow(
      foundEntity.userExtension.id
    );
    if (!targetWindow) {
      return;
    }
    sendWindow(targetWindow, 'user-extension-item-deleted', {
      id: event.entityId,
    });
  }
}
