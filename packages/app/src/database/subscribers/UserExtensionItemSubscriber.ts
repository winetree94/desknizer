import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { ipcMain } from 'electron';
import { UserExtensionItem } from '../entities/UserExtension';

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
    ipcMain.emit('user-extension-item-inserted', event.entity);
  }

  afterUpdate(
    event: UpdateEvent<UserExtensionItem<T, I>>
  ): Promise<void> | void {
    ipcMain.emit('user-extension-item-updated', event.entity);
  }

  afterRemove(
    event: RemoveEvent<UserExtensionItem<T, I>>
  ): Promise<void> | void {
    ipcMain.emit('user-extension-item-removed', event.entityId);
  }
}
