import { useToast } from '@/hooks/useToast';
import { MatkulService } from '@/services/matkul.service';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useMutation, useQueryClient } from 'react-query';

export function DeleteMatkulDialog(props: {
    visible: boolean;
    onHide: () => void;
    matkulToDelete: Matkul | null;
}) {
    const { visible, onHide, matkulToDelete } = props;
    const { toastRef, showSuccess, showError } = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: MatkulService.remove,
        onSuccess: () => {
            showSuccess('Berhasil menghapus matkul');
            queryClient.invalidateQueries(['allMatkul']);
            onHide();
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data.error;
                showError(`Gagal menghapus matkul: ${errorMsg}`);
            }
            onHide();
        },
    });

    return matkulToDelete ? (
        <>
            <Toast ref={toastRef} position="bottom-right" />
            <Dialog
                visible={visible}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={
                    <DialogFooter
                        onClose={onHide}
                        onDeleteMatkul={() => mutation.mutate(matkulToDelete)}
                    />
                }
                onHide={onHide}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: '2rem' }}
                    />

                    <span
                        style={{
                            marginLeft: '16px',
                            position: 'relative',
                            bottom: '8px',
                        }}
                    >
                        Anda yakin ingin menghapus matkul{' '}
                        <b>{matkulToDelete.namaMatkul}</b>?
                    </span>
                </div>
            </Dialog>
        </>
    ) : null;
}

export function DialogFooter(props: {
    onClose: () => void;
    onDeleteMatkul: () => void;
}) {
    const { onClose, onDeleteMatkul } = props;
    return (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={onClose} />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={onDeleteMatkul}
            />
        </>
    );
}
