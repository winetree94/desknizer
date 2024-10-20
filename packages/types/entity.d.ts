export type Extension<T> = {
  id: string;
  name: string;
  description: string;
  meta: T;
  devPort: number;
};

export type ExtensionItem<T> = {
  id: string;
  data: T;
};

export type Widget<T> = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  extensionItem: ExtensionItem<T>;
};
