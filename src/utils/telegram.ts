declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            username: string;
            id: number;
          };
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

export const tg = window.Telegram.WebApp;

export const getStorageKey = () => {
  const userId = tg.initDataUnsafe?.user?.id;
  return `crypto_guesser_${userId}`;
};

export const saveUserData = (data: any) => {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(data));
};

export const getUserData = () => {
  const key = getStorageKey();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};