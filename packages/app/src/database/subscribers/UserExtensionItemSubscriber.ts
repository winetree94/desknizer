import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { ipcMain } from 'electron';
import { UserExtensionItem } from '../entities/UserExtension';
import { ExtensionManager } from '../../extension';

@EventSubscriber()
export class UserExtensionItemSubscriber<T extends object, I extends object>
  implements EntitySubscriberInterface<UserExtensionItem<T, I>>
{
  listenTo() {
    return UserExtensionItem;
  }

  afterInsert(
    event: InsertEvent<UserExtensionItem<T, I>>
  ): Promise<void> | void {
    const targetWindow = ExtensionManager.getOpenedExtensionWindow(
      event.entity.userExtension.id
    );
    targetWindow?.webContents.send(
      'user-extension-item-inserted',
      event.entity
    );
  }

  afterUpdate(
    event: UpdateEvent<UserExtensionItem<T, I>>
  ): Promise<void> | void {
    console.log('UserExtensionItemSubscriber.afterUpdate', event.entity);
    ipcMain.emit('user-extension-item-updated', event.entity);

    // ExtensionManager.getOpenedExtensionWindow(
    //   event.entity.userExtension.id
    // )?.webContents.send('user-extension-item-updated', event.entity);
  }

  afterRemove(
    event: RemoveEvent<UserExtensionItem<T, I>>
  ): Promise<void> | void {
    console.log('UserExtensionItemSubscriber.afterRemove', event.entityId);
    ipcMain.emit('user-extension-item-removed', event.entityId);

    // ExtensionManager.getOpenedExtensionWindow(
    //   event.entity.userExtension.id
    // )?.webContents.send('user-extension-item-removed', event.entity
  }
}
