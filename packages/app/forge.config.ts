import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
// import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import AutoUnpackNativesPlugin from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
const config: ForgeConfig = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'winetree94',
          name: 'note2',
        },
        prerelease: true,
      },
    },
  ],
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {
    force: true,
  },
  makers: [
    new MakerSquirrel({
      name: 'noteapp',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          // {
          //   html: './windows/app/index.html',
          //   js: './windows/app/main.tsx',
          //   name: 'main_window',
          //   preload: {
          //     js: './src/preload.ts',
          //   },
          // },
          {
            html: './windows/settings/index.html',
            js: './windows/settings/main.tsx',
            name: 'settings_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // new VitePlugin({
    //   // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
    //   // If you are familiar with Vite configuration, it will look really familiar.
    //   build: [
    //     {
    //       // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
    //       entry: 'src/main.ts',
    //       config: 'vite.main.config.ts',
    //       target: 'main',
    //     },
    //     {
    //       entry: 'src/preload.ts',
    //       config: 'vite.preload.config.ts',
    //       target: 'preload',
    //     },
    //   ],
    //   renderer: [
    //     {
    //       name: 'main_window',
    //       config: 'vite.renderer.main.config.ts',
    //     },
    //     {
    //       name: 'settings_window',
    //       config: 'vite.renderer.settings.config.ts',
    //     },
    //   ],
    // }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
