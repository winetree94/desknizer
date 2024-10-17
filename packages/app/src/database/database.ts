import { app } from 'electron';
import path from 'node:path';
import { DataSource } from 'typeorm';
import {
  UserExtension,
  UserExtensionItem,
  UserWidget,
} from './entities/UserExtension';
import { UserExtensionSubscriber } from './subscribers/UserExtensionSubscriber';
import { UserExtensionItemSubscriber } from './subscribers/UserExtensionItemSubscriber';
import { UserWidgetSubscriber } from './subscribers/UserWidgetSubscriber';

const databasePath = path.join(app.getPath('userData'), 'note.db');
console.log('db path: ', databasePath);

const db = new DataSource({
  type: 'better-sqlite3',
  database: databasePath,
  synchronize: true,
  logging: true,
  entities: [UserExtension, UserExtensionItem, UserWidget],
  subscribers: [
    UserExtensionSubscriber,
    UserExtensionItemSubscriber,
    UserWidgetSubscriber,
  ],
});

let initialized = false;

export const DatabaseManager = {
  load: async () => {
    if (initialized) {
      return;
    }
    await db.initialize();
    initialized = true;
  },
  seed: async () => {},
  get: () => db,
};
