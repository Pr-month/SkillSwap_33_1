import { useCallback } from 'react';

interface ShareData {
  title: string;
  text: string;
  url?: string;
}

interface UseShareReturn {
  share: (data: ShareData) => Promise<boolean>;
  isSupported: boolean;
}

export const useShare = (): UseShareReturn => {
  const isSupported = useCallback(() => {
    return !!navigator.share;
  }, []);

  const fallbackShare = useCallback((data: ShareData): boolean => {
    try {
      // Копируем URL в буфер обмена
      if (data.url) {
        navigator.clipboard.writeText(data.url);
      }

      // Показываем уведомление пользователю
      alert(`Ссылка скопирована в буфер обмена:\n${data.url || data.title}`);
      return true;
    } catch (error) {
      console.error('Fallback share failed:', error);
      return false;
    }
  }, []);

  const share = useCallback(
    async (data: ShareData): Promise<boolean> => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: data.title,
            text: data.text,
            url: data.url,
          });
          return true;
        } else {
          // Fallback для браузеров, которые не поддерживают Web Share API
          return fallbackShare(data);
        }
      } catch (error) {
        console.error('Share failed:', error);
        return false;
      }
    },
    [fallbackShare],
  );

  return {
    share,
    isSupported: isSupported(),
  };
};
