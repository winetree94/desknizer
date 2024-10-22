import { app, net, protocol } from 'electron';
import path from 'path';
import { pathToFileURL } from 'url';

export const APP_SCHEME = 'app';

let initialized = false;

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      bypassCSP: true,
      supportFetchAPI: true,
      secure: true,
      standard: true,
      stream: true,
      codeCache: true,
      corsEnabled: true,
      allowServiceWorkers: true,
    },
  },
]);

const load = async () => {
  if (initialized) {
    return;
  }
  await app.whenReady();
  protocol.handle(APP_SCHEME, (req) => {
    const { host, pathname } = new URL(req.url);
    if (pathname === '/') {
      const indexPath = path.resolve(
        __dirname,
        'extensions',
        host,
        'index.html'
      );
      console.log(indexPath);
      return net.fetch(pathToFileURL(indexPath).toString());
    }

    const pathToServe = path.resolve(
      __dirname,
      'extensions',
      host,
      pathname.slice(1)
    );
    return net.fetch(pathToFileURL(pathToServe).toString());
  });
  initialized = true;
};

export const ProtocolManager = {
  load: load,
};
