import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { UserExtension, UserExtensionItem } from '../entities/UserExtension';
import { ExtensionManager } from '../../extension';
import { sendWindow } from '../../ipc-main';
import { ExtensionItem } from '@note/types/entity';
import { DatabaseManager } from '../database';

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
    sendWindow(targetWindow, 'user-extension-item-inserted', {
      item: event.entity,
    });
  }

  afterUpdate(
    event: UpdateEvent<UserExtensionItem<T, I>>
  ): Promise<void> | void {
    if (!event.entity) {
      return;
    }
    const targetWindow = ExtensionManager.getOpenedExtensionWindow(
      event.entity.userExtension.id
    );
    sendWindow(targetWindow, 'user-extension-item-updated', {
      item: event.entity as ExtensionItem<unknown>,
    });
  }

  beforeRemove(
    event: RemoveEvent<UserExtensionItem<T, I>>
  ): Promise<void> | void {
    // const manager = DatabaseManager.get().manager;
    // const foundEntity = manager.findOne(UserExtensionItem, {
    //   where: {
    //     id: event.entityId,
    //   },
    //   relations: {
    //     userExtension: true,
    //   },
    // });
    // console.log(foundEntity);
    // if (!event.entityId) {
    //   return;
    // }
    // const targetWindow = ExtensionManager.getOpenedExtensionWindow(
    //   event.entityId
    // );
    // sendWindow(targetWindow, 'user-extension-item-deleted', {
    //   id: event.entityId,
    // });
  }
}
