import { useGetAllFakultas } from '@/hooks/useGetAllFakultas';
import { useToast } from '@/hooks/useToast';
import { JurusanService } from '@/services/jurusan.service';
import { LoadingSpinner } from '@/shared-components/LoadingSpinner';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';

export function AddJurusanDialog(props: {
    visible: boolean;
    onHide: () => void;
}) {
    const [newJurusanName, setNewJurusanName] = useState('');
    const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(
        null
    );
    const { visible, onHide } = props;
    const { toastRef, showSuccess, showError } = useToast();
    const {
        data: fakultasOptions,
        isLoading: isFakultasFetchLoading,
        isError: isFakultasFetchError,
    } = useGetAllFakultas();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: JurusanService.add,
        onSuccess: () => {
            showSuccess('Berhasil menambahkan jurusan');
            queryClient.invalidateQueries(['allJurusan']);
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data.error;
                showError(
                    `Gagal menambahkan jurusan: ${errorMsg}. Pastikan atribut JSON valid dan lengkap,` +
                        ' serta atribut jurusan unik'
                );
            }
        },
    });

    useEffect(() => {
        setNewJurusanName('');
        setSelectedFakultas(null);
    }, [visible]);

    return (
        <>
            <Toast ref={toastRef} position="bottom-right" />
            <Dialog
                header="Tambahkan jurusan baru"
                pt={{ header: { style: { paddingBottom: '0' } } }}
                visible={visible}
                style={{ width: '35vw' }}
                onHide={onHide}
                blockScroll
            >
                {isFakultasFetchLoading ? (
                    <LoadingSpinner message="Loading fakultas data" />
                ) : isFakultasFetchError ? (
                    <Message
                        severity="error"
                        text="Error fetching fakultas data"
                    />
                ) : (
                    <>
                        <span
                            className="p-float-label"
                            style={{ marginTop: '24px' }}
                        >
                            <Dropdown
                                inputId="selectedFakultas"
                                pt={{ root: { style: { width: '211px' } } }}
                                value={selectedFakultas}
                                onChange={(e) => setSelectedFakultas(e.value)}
                                options={fakultasOptions}
                                optionLabel="namaFakultas"
                            />
                            <label htmlFor="selectedFakultas">
                                Nama Fakultas
                            </label>
                        </span>
                        <span
                            className="p-float-label"
                            style={{ marginTop: '24px' }}
                        >
                            <InputText
                                id="newJurusanName"
                                value={newJurusanName}
                                onChange={(e) => {
                                    setNewJurusanName(e.target.value);
                                }}
                            />
                            <label htmlFor="newJurusanName">Nama Jurusan</label>
                        </span>
                        <Button
                            label="Save"
                            pt={{ root: { style: { marginTop: '24px' } } }}
                            icon="pi pi-check"
                            disabled={!(newJurusanName && selectedFakultas)}
                            onClick={(e) => {
                                mutation.mutate([
                                    {
                                        namaJurusan: newJurusanName,
                                        namaFakultas:
                                            selectedFakultas?.namaFakultas!,
                                    },
                                ]);
                                props.onHide();
                            }}
                        />
                    </>
                )}
            </Dialog>
        </>
    );
}
