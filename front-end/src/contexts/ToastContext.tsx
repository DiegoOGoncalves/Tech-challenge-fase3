import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import styled from 'styled-components';

type Toast = { id: number; message: string; type: 'success' | 'error' };
const ToastContext = createContext<
  { show: (message: string, type?: Toast['type']) => void } | undefined
>(undefined);
const Region = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 20;
  display: grid;
  gap: 10px;
  max-width: min(360px, calc(100vw - 32px));
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.ink};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(
      () => setToasts((current) => current.filter((toast) => toast.id !== id)),
      3500,
    );
  };
  const value = useMemo(() => ({ show }), []);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <Region aria-live="polite">
        {toasts.map((toast) => (
          <Item key={toast.id}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {toast.message}
            <button
              aria-label="Fechar notificação"
              onClick={() =>
                setToasts((current) =>
                  current.filter((item) => item.id !== toast.id),
                )
              }
            >
              <X size={16} color="white" />
            </button>
          </Item>
        ))}
      </Region>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  return context;
}
