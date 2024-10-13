import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { UserExtension } from '../entities/UserExtension';
import { ipcMain } from 'electron';

@EventSubscriber()
export class UserExtensionSubscriber<T extends object, I extends object>
  implements EntitySubscriberInterface<UserExtension<T, I>>
{
  listenTo() {
    return UserExtension;
  }

  afterInsert(event: InsertEvent<UserExtension<T, I>>): Promise<void> | void {
    ipcMain.emit('user-extension-inserted', event.entity);
  }

  afterUpdate(event: UpdateEvent<UserExtension<T, I>>): Promise<void> | void {
    ipcMain.emit('user-extension-updated', event.entity);
  }

  afterRemove(event: RemoveEvent<UserExtension<T, I>>): Promise<void> | void {
    ipcMain.emit('user-extension-removed', event.entityId);
  }
}
