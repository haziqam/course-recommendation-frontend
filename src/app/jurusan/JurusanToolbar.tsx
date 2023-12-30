import { useToast } from '@/hooks/useToast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useQueryClient } from 'react-query';

export function JurusanToolbar(props: { onAddJurusanClick: () => void }) {
    const { onAddJurusanClick } = props;
    const { toastRef, showSuccess, showError } = useToast();
    const queryClient = useQueryClient();
    const startContent = (
        <>
            <Button
                label="New"
                icon="pi pi-plus"
                className="mr-2"
                pt={{ root: { style: { marginRight: '16px' } } }}
                onClick={onAddJurusanClick}
            />
            <FileUpload
                mode="basic"
                name="Jurusan[]"
                url="http://localhost:5000/jurusan/addFromFile"
                accept=".json"
                maxFileSize={1000000}
                auto
                chooseLabel="Batch upload (JSON file)"
                onUpload={() => {
                    showSuccess('Berhasil menambahkan jurusan');
                    queryClient.invalidateQueries(['allJurusan']);
                }}
                onError={(e) => {
                    const response = JSON.parse(e.xhr.response);
                    showError(
                        `Gagal menambahkan jurusan: ${response.error}. Pastikan atribut JSON valid dan lengkap,` +
                            ' namaJurusan harus unik, serta namaFakultas tersedia pada tabel fakultas'
                    );
                }}
            />
        </>
    );

    return (
        <>
            <Toast ref={toastRef} position="bottom-right" />
            <div style={{ paddingBottom: '32px' }}>
                <Toolbar start={startContent}></Toolbar>
            </div>
        </>
    );
}
