import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'action';

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {

  const removeNotification = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
        case 'info':
            toast.info(message);
            break;
        default:
            toast(message);
            break;
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
