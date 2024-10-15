import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { UserWidget } from '../entities/UserExtension';
import { WidgetManager } from '../../widget';

@EventSubscriber()
export class UserWidgetSubscriber<T extends object, I extends object>
  implements EntitySubscriberInterface<UserWidget<T, I>>
{
  listenTo() {
    return UserWidget;
  }

  afterInsert(event: InsertEvent<UserWidget<T, I>>): Promise<void> | void {
    console.log('widget created');
    console.log(event.entity);
    if (WidgetManager.openedWidgetWindows.get(event.entity.id)) {
      return;
    }
    WidgetManager.createWidgetWindow({
      extensionId: event.entity.userExtensionItem.userExtension.id,
      widgetId: event.entity.id,
    });
  }

  afterUpdate(event: UpdateEvent<UserWidget<T, I>>): Promise<void> | void {}

  afterRemove(event: RemoveEvent<UserWidget<T, I>>): Promise<void> | void {}
}
