import { useToast } from '@/hooks/useToast';
import { FakultasService } from '@/services/fakultas.service';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useMutation, useQueryClient } from 'react-query';

export function DeleteFakultasDialog(props: {
    visible: boolean;
    onHide: () => void;
    fakultasToDelete: Fakultas | null;
}) {
    const { visible, onHide, fakultasToDelete } = props;
    const queryClient = useQueryClient();
    const { toastRef, showSuccess, showError } = useToast();
    const mutation = useMutation({
        mutationFn: FakultasService.remove,
        onSuccess: () => {
            showSuccess('Fakultas berhasil dihapus');
            queryClient.invalidateQueries();
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

    return fakultasToDelete ? (
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
                        onDelete={() => mutation.mutate(fakultasToDelete)}
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
                        <b>{fakultasToDelete.namaFakultas}</b>?
                    </span>
                </div>
            </Dialog>
        </>
    ) : null;
}

function DialogFooter(props: { onClose: () => void; onDelete: () => void }) {
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
