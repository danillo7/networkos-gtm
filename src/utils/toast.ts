import { toast } from 'sonner';

export const showToast = {
  success: (message: string) => toast.success(message, {
    style: { background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }
  }),
  error: (message: string) => toast.error(message, {
    style: { background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }
  }),
  info: (message: string) => toast.info(message),
  loading: (message: string) => toast.loading(message),
  copied: () => toast.success('Copiado!', { duration: 2000 }),
  saved: () => toast.success('Salvo com sucesso!'),
  imported: () => toast.success('Importado!'),
};
