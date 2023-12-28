import { Toast } from 'primereact/toast'
import { RefObject } from 'react'

export const showSuccess = (toastRef: RefObject<Toast>, msgDetail: string) => {
    toastRef.current!.show({
        severity: 'success',
        summary: 'Success',
        detail: msgDetail,
        life: 3000,
    })
}

export const showError = (toastRef: RefObject<Toast>, msgDetail: string) => {
    toastRef.current!.show({
        severity: 'error',
        summary: 'Error',
        detail: msgDetail,
        life: 3000,
    })
}

export const showInfo = (toastRef: RefObject<Toast>, msgDetail: string) => {
    toastRef.current!.show({
        severity: 'info',
        summary: 'Info',
        detail: msgDetail,
        life: 3000,
    })
}
