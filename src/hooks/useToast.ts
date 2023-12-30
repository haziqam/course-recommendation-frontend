import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export function useToast() {
    const toastRef = useRef<Toast | null>(null);
    const showSuccess = (msgDetail: string) => {
        toastRef?.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: msgDetail,
            life: 3000,
        });
    };

    const showError = (msgDetail: string) => {
        toastRef?.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: msgDetail,
            life: 3000,
        });
    };

    const showInfo = (msgDetail: string) => {
        toastRef?.current?.show({
            severity: 'info',
            summary: 'Info',
            detail: msgDetail,
            life: 3000,
        });
    };

    const showWarn = (msgDetail: string) => {
        toastRef?.current?.show({
            severity: 'warn',
            summary: 'Warn',
            detail: msgDetail,
            life: 3000,
        });
    };
    return { toastRef, showSuccess, showError, showInfo, showWarn };
}
