import { createContext, ReactNode, useContext, useState } from 'react';
import { Widget } from '@desknizer/types/entity';

interface WidgetProviderContextValue<T> {
  widget: Widget<T> | null;
}

const WidgetProviderContext = createContext<
  WidgetProviderContextValue<unknown>
>({
  widget: null,
});

export interface WidgetProviderProps {
  children: ReactNode;
}

let widgetInfo: Widget<object> | null = null;

const getWidgetInfoPromise = window.electron.ipcRenderer
  .invoke<object>('get-widget-info')
  .then((res) => (widgetInfo = res));

export function WidgetProvider(props: WidgetProviderProps) {
  if (!widgetInfo) {
    throw getWidgetInfoPromise;
  }
  const [widget] = useState(widgetInfo);

  return (
    <WidgetProviderContext.Provider value={{ widget: widget }}>
      {props.children}
    </WidgetProviderContext.Provider>
  );
}

export function useWidget<T>() {
  const { widget } = useContext(WidgetProviderContext);
  return widget as Widget<T>;
}
