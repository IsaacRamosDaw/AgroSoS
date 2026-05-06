import { CToaster, CToast, CToastBody, CToastClose } from '@coreui/react';
import { useToast } from '../hook/toast/ToastContext';

const COLOR_MAP = {
  success: "success",
  error: "danger",
  warning: "warning",
  info: "info",
};

export const ToastNotification = () => {
  const { toasts } = useToast();

  return (
    <CToaster placement="top-end" style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 9999 }}>
      {toasts.map(toast => (
        <CToast key={toast.id} visible autohide delay={3000} color={COLOR_MAP[toast.type] || "info"}>
          <div className="d-flex align-items-center">
            <CToastBody className="text-white">{toast.message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      ))}
    </CToaster>
  );
};
