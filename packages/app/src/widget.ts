import { whenNotQuitting } from './windows';
import { type Size, screen, BrowserWindow } from 'electron';
import { isDevelopment } from './utils';
import { APP_SCHEME } from './protocol';
import { ExtensionMeta } from './extension';
import { handleIpc, sendWindow } from './ipc-main';
import { DatabaseManager } from './database/database';
import { debounce } from 'lodash-es';
import {
  UserExtensionItem,
  UserWidget,
} from './database/entities/UserExtension';

export interface OpenExtensionWidgetParams {
  extensionId: string;
  widgetId: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const openedWidgetWindows = new Map<string, BrowserWindow>();

const createWidgetWindow = (params: OpenExtensionWidgetParams) => {
  if (openedWidgetWindows.has(params.widgetId)) {
    const window = openedWidgetWindows.get(params.widgetId)!;
    window.focus();
    return window;
  }

  // Create the browser window.
  const widgetWindow = new BrowserWindow({
    width: params.width || 800,
    height: params.height || 600,
    x: params.x || 100,
    y: params.y || 100,
    frame: false,
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  });

  if (isDevelopment) {
    widgetWindow.loadURL(
      `http://localhost:${ExtensionMeta[params.extensionId].devPort}/widget.html`
    );
  } else {
    widgetWindow.loadURL(
      `${APP_SCHEME}://extensions.${params.extensionId}/widget.html`
    );
  }

  const onMoveOrResize = debounce(async () => {
    const [width, height] = widgetWindow.getSize();
    const [x, y] = widgetWindow.getPosition();
    const manager = DatabaseManager.get().manager;
    const widget = await manager.findOne(UserWidget, {
      where: { id: params.widgetId },
    });
    if (!widget) {
      return;
    }
    widget.width = width;
    widget.height = height;
    widget.x = x;
    widget.y = y;
    await manager.save(widget);
  }, 100);

  const onClose = whenNotQuitting(async () => {
    openedWidgetWindows.delete(params.widgetId);
    widgetWindow.removeListener('move', onMoveOrResize);
    widgetWindow.removeListener('resize', onMoveOrResize);
    widgetWindow.removeListener('closed', onClose);
    widgetWindow.removeListener('focus', onFocus);
    widgetWindow.removeListener('blur', onBlur);
    const manager = DatabaseManager.get().manager;
    const entity = await manager.findOne(UserWidget, {
      where: { id: params.widgetId },
    });
    if (!entity) {
      return;
    }
    await manager.remove(entity);
  });

  const onFocus = () => {
    sendWindow(widgetWindow, 'on-window-focus-change', {
      focused: true,
    });
  };

  const onBlur = () => {
    sendWindow(widgetWindow, 'on-window-focus-change', {
      focused: false,
    });
  };

  widgetWindow.on('move', onMoveOrResize);
  widgetWindow.on('resize', onMoveOrResize);
  widgetWindow.on('closed', onClose);
  widgetWindow.on('focus', onFocus);
  widgetWindow.on('blur', onBlur);

  openedWidgetWindows.set(params.widgetId, widgetWindow);
  return widgetWindow;
};

function parsePosition(
  size: Size,
  pos?: {
    x: number;
    y: number;
  }
) {
  // return screen center position
  if (!pos) {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    return {
      x: (width - size.width) / 2,
      y: (height - size.height) / 2,
    };
  }
  return pos;
}

handleIpc('get-widget-info', async (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) {
    throw new Error('Window not found');
  }
  const widgetId = Array.from(openedWidgetWindows.entries()).find(
    ([, win]) => win === window
  )?.[0];
  if (!widgetId) {
    throw new Error('Widget not found');
  }
  const manager = DatabaseManager.get().manager;
  const widget = await manager.findOne(UserWidget, {
    where: { id: widgetId },
    relations: {
      userExtensionItem: true,
    },
  });
  if (!widget) {
    throw new Error('Entity not found');
  }
  return {
    id: widget.id,
    x: widget.x,
    y: widget.y,
    width: widget.width,
    height: widget.height,
    extensionItem: {
      id: widget.userExtensionItem.id,
      data: widget.userExtensionItem.data,
    },
  };
});

handleIpc('create-widget', async (event, args) => {
  const manager = DatabaseManager.get().manager;
  const existWidgetEntity = await manager.findOne(UserWidget, {
    where: {
      userExtensionItem: {
        id: args.id,
      },
    },
  });
  if (existWidgetEntity) {
    openedWidgetWindows.get(existWidgetEntity.id)?.focus();
    return existWidgetEntity;
  }
  const targetSize = {
    width: args.size?.width || 200,
    height: args.size?.height || 200,
  };
  const targetPos = parsePosition(targetSize, args.pos);
  const itemEntity = await manager.findOne(UserExtensionItem, {
    where: { id: args.id },
    relations: {
      userExtension: true,
    },
  });
  if (!itemEntity) {
    throw new Error('Entity not found');
  }
  const widgetEntity = manager.create(UserWidget, {
    userExtensionItem: itemEntity,
    x: targetPos.x,
    y: targetPos.y,
    width: targetSize.width,
    height: targetSize.height,
  });
  return await manager.save(widgetEntity);
});

handleIpc('update-widget', async (event, args) => {
  const manager = DatabaseManager.get().manager;
  const widget = await manager.findOne(UserWidget, {
    where: { id: args.id },
  });
  if (!widget) {
    throw new Error('Entity not found');
  }
  widget.x = args.pos?.x || widget.x;
  widget.y = args.pos?.y || widget.y;
  widget.width = args.size?.width || widget.width;
  widget.height = args.size?.height || widget.height;
  return await manager.save(widget);
});

handleIpc('delete-widget', async (event, args) => {
  const manager = DatabaseManager.get().manager;
  const entity = await manager.findOne(UserWidget, {
    where: { id: args.id },
  });
  if (!entity) {
    throw new Error('Entity not found');
  }
  await manager.remove(entity);
  return { id: args.id };
});

export const WidgetManager = {
  load: async () => {
    const manager = DatabaseManager.get().manager;
    const widgets = await manager.find(UserWidget, {
      relations: {
        userExtensionItem: {
          userExtension: true,
        },
      },
    });
    widgets.forEach((widget) => {
      createWidgetWindow({
        extensionId: widget.userExtensionItem.userExtension.id,
        widgetId: widget.id,
        x: widget.x,
        y: widget.y,
        width: widget.width,
        height: widget.height,
      });
    });
  },
  createWidgetWindow: createWidgetWindow,
  openedWidgetWindows,
};
