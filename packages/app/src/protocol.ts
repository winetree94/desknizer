import { app, net, protocol } from 'electron';
import path from 'path';
import { pathToFileURL } from 'url';
import { getPublicPath } from './utils';

export const APP_SCHEME = 'app';

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
  await app.whenReady();
  protocol.handle(APP_SCHEME, (req) => {
    const { host: rawHost, pathname } = new URL(req.url);
    const [basePath, uuid] = rawHost.split('.');
    const hasFileExtension = pathname.includes('.');
    const indexPath = path.resolve(
      getPublicPath(),
      basePath,
      uuid,
      'index.html'
    );
    if (pathname === '/' || pathname === '' || pathname === '/index.html') {
      return net.fetch(pathToFileURL(indexPath).toString());
    } else if (hasFileExtension) {
      const pathToServe = path.resolve(
        getPublicPath(),
        basePath,
        uuid,
        pathname.slice(1)
      );
      return net.fetch(pathToFileURL(pathToServe).toString());
    }
    return net.fetch(pathToFileURL(indexPath).toString());
  });
};

export const ProtocolManager = {
  load: load,
};
