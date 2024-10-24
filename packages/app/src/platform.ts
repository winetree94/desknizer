import os from 'os';

export interface PlatformSwitchOptions<T> {
  darwin?: T;
  linux?: T;
  win32?: T;
  default: T;
}

export const platformSwitch = <T>(chooseType: PlatformSwitchOptions<T>): T => {
  switch (os.platform()) {
    case 'darwin':
      return chooseType.darwin ?? chooseType.default;
    case 'linux':
      return chooseType.linux ?? chooseType.default;
    case 'win32':
      return chooseType.win32 ?? chooseType.default;
    default:
      return chooseType.default;
  }
};

export interface ArchSwitchOptions<T> {
  arm?: T;
  arm64?: T;
  ia32?: T;
  x64?: T;
  default: T;
}

export const archSwitch = <T>(chooseType: ArchSwitchOptions<T>): T => {
  switch (os.arch()) {
    case 'arm':
      return chooseType.arm ?? chooseType.default;
    case 'arm64':
      return chooseType.arm64 ?? chooseType.default;
    case 'ia32':
      return chooseType.ia32 ?? chooseType.default;
    case 'x64':
      return chooseType.x64 ?? chooseType.default;
    default:
      return chooseType.default;
  }
};
