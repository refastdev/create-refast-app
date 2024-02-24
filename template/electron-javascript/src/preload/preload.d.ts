import type { ElectronType } from './preload.ts';

declare global {
  interface Window {
    electron: ElectronType;
  }
}

export {};
