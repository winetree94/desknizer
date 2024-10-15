import { PreloadApis } from './preload';

declare global {
  interface Window extends PreloadApis {}
}
