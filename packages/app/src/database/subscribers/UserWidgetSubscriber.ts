import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { UserWidget } from '../entities/UserExtension';
import { WidgetManager } from '../../widget';
import { sendWindow } from '../../ipc-main';
import {BrowserWindow} from "electron";

@EventSubscriber()
export class UserWidgetSubscriber<T extends object, I extends object>
  implements EntitySubscriberInterface<UserWidget<T, I>>
{
  public listenTo() {
    return UserWidget;
  }

  public afterInsert(
    event: InsertEvent<UserWidget<T, I>>
  ): Promise<void> | void {
    if (WidgetManager.openedWidgetWindows.get(event.entity.id)) {
      return;
    }
    WidgetManager.createWidgetWindow({
      extensionId: event.entity.userExtensionItem.userExtension.id,
      widgetId: event.entity.id,
      x: event.entity.x,
      y: event.entity.y,
      width: event.entity.width,
      height: event.entity.height,
    });
  }

  public afterUpdate(
    event: UpdateEvent<UserWidget<T, I>>
  ): Promise<void> | void {
    if (!event.entity) {
      return;
    }
    const window = WidgetManager.openedWidgetWindows.get(event.entity.id);
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (!window || window === focusedWindow) {
      return;
    }
    window.setBounds({
      x: event.entity.x,
      y: event.entity.y,
      width: event.entity.width,
      height: event.entity.height,
    });
  }

  public afterRemove(
    event: RemoveEvent<UserWidget<T, I>>
  ): Promise<void> | void {
    const window = WidgetManager.openedWidgetWindows.get(event.entityId);
    if (!window) {
      return;
    }
    window.close();
  }
}
