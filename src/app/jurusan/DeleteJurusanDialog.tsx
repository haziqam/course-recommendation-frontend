import { useToast } from '@/hooks/useToast';
import { JurusanService } from '@/services/jurusan.service';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useMutation, useQueryClient } from 'react-query';

export function DeleteJurusanDialog(props: {
    visible: boolean;
    onHide: () => void;
    jurusanToDelete: Jurusan | null;
}) {
    const { visible, onHide, jurusanToDelete } = props;
    const { toastRef, showSuccess, showError } = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: JurusanService.remove,
        onSuccess: () => {
            showSuccess('Jurusan berhasil dihapus');
            queryClient.invalidateQueries(['allJurusan']);
            onHide();
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data.error;
                showError(`Gagal menghapus fakultas: ${errorMsg}.`);
            }
            onHide();
        },
    });
    return jurusanToDelete ? (
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
                        onDelete={() => {
                            mutation.mutate(jurusanToDelete);
                        }}
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
                        Anda yakin ingin menghapus{' '}
                        <b>{jurusanToDelete.namaJurusan}</b>?
                    </span>
                </div>
            </Dialog>
        </>
    ) : null;
}

export function DialogFooter(props: {
    onClose: () => void;
    onDelete: () => void;
}) {
    const { onClose, onDelete } = props;
    return (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={onClose} />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={onDelete}
            />
        </>
    );
}
