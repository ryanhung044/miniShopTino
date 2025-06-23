import zmp from 'zmp-sdk';

type StorageInterface = {
  getItem: (key: string) => string | undefined;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const nativeStorage: StorageInterface = {
  getItem: (key: string): string | undefined => {
    try {
      if (typeof zmp !== 'undefined' && (zmp as any).storage?.getItemSync) {
        const result = (zmp as any).storage.getItemSync({ key });
        return result?.value;
      }
      return localStorage.getItem(key) ?? undefined;
    } catch (err) {
      console.error('getItem error:', err);
      return undefined;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof zmp !== 'undefined' && (zmp as any).storage?.setItem) {
        (zmp as any).storage.setItem({ key, value });
      } else {
        localStorage.setItem(key, value);
      }
    } catch (err) {
      console.error('setItem error:', err);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof zmp !== 'undefined' && (zmp as any).storage?.removeItem) {
        (zmp as any).storage.removeItem({ key });
      } else {
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.error('removeItem error:', err);
    }
  }
};

export default nativeStorage;
