import { useToast } from '@/hooks/useToast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

export function MatkulToolbar(props: { onAddJurusanClick: () => void }) {
    const { onAddJurusanClick } = props;
    const { toastRef, showSuccess, showError } = useToast();

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
                name="Matkul[]"
                url="http://localhost:5000/matkul/addFromFile"
                accept=".json"
                maxFileSize={1000000}
                auto
                chooseLabel="Batch upload (JSON file)"
                onUpload={(e) => {
                    showSuccess('Berhasil menambahkan matkul');
                }}
                onError={(e) => {
                    const response = JSON.parse(e.xhr.response);
                    showError(
                        `Gagal menambahkan matkul: ${response.error}. Pastikan atribut JSON valid dan lengkap,` +
                            ' namaMatkul harus unik terhadap namaJurusan, serta namaJurusan' +
                            ' tersedia pada tabel jurusan'
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
