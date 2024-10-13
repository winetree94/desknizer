import { app } from 'electron';
import path from 'node:path';
import { DataSource } from 'typeorm';
import {
  UserExtension,
  UserExtensionItem,
  UserWidget,
} from './entities/UserExtension';
import { UserExtensionSubscriber } from './subscribers/UserExtensionSubscriber';

const databasePath = path.join(app.getPath('userData'), 'note.db');

const db = new DataSource({
  type: 'sqlite',
  database: databasePath,
  synchronize: true,
  logging: true,
  entities: [UserExtension, UserExtensionItem, UserWidget],
  subscribers: [UserExtensionSubscriber],
});

export const DatabaseManager = {
  load: async () => {
    await db.initialize();
  },
  seed: async () => {},
  get: () => db,
};
