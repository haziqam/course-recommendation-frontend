import { useToast } from '@/hooks/useToast';
import { FakultasService } from '@/services/fakultas.service';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';

export function AddFakultasDialog(props: {
    visible: boolean;
    onHide: () => void;
}) {
    const [newFakultasName, setNewFakultasName] = useState('');
    const { visible, onHide } = props;
    const { toastRef, showSuccess, showError } = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: FakultasService.add,
        onSuccess: () => {
            showSuccess('Berhasil menambahkan fakultas');
            queryClient.invalidateQueries(['allFakultas']);
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data.error;
                showError(
                    `Gagal menambahkan fakultas: ${errorMsg}. Pastikan atribut JSON valid dan lengkap,` +
                        ' serta atribut fakultas unik'
                );
            }
        },
    });

    useEffect(() => {
        setNewFakultasName('');
    }, [visible]);

    return (
        <>
            <Toast ref={toastRef} position="bottom-right" />
            <Dialog
                header="Tambahkan fakultas baru"
                pt={{ header: { style: { paddingBottom: '0' } } }}
                visible={visible}
                style={{ width: '35vw' }}
                onHide={onHide}
                blockScroll
            >
                <span className="p-float-label" style={{ marginTop: '24px' }}>
                    <InputText
                        id="namaFakultas"
                        value={newFakultasName}
                        onChange={(e) => {
                            setNewFakultasName(e.target.value);
                        }}
                    />
                    <label htmlFor="namaFakultas">Nama Fakultas</label>
                </span>
                <Button
                    label="Save"
                    pt={{ root: { style: { marginTop: '24px' } } }}
                    icon="pi pi-check"
                    disabled={newFakultasName === ''}
                    onClick={() => {
                        mutation.mutate([{ namaFakultas: newFakultasName }]);
                        onHide();
                    }}
                />
            </Dialog>
        </>
    );
}
