import { useToast } from '@/hooks/useToast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

export function FakultasToolbar(props: { onAddFakultasClick: () => void }) {
    const { onAddFakultasClick } = props;
    const { toastRef, showSuccess, showError } = useToast();
    const startContent = (
        <>
            <Button
                label="New"
                pt={{ root: { style: { marginRight: '16px' } } }}
                icon="pi pi-plus"
                className="mr-2"
                onClick={onAddFakultasClick}
            />
            <FileUpload
                mode="basic"
                name="Fakultas[]"
                url="http://localhost:5000/fakultas/addFromFile"
                accept=".json"
                maxFileSize={1000000}
                auto
                chooseLabel="Batch upload (JSON file)"
                onUpload={() => showSuccess('Berhasil menambahkan fakultas')}
                onError={(e) => {
                    const response = JSON.parse(e.xhr.response);
                    showError(
                        `Gagal menambahkan fakultas: ${response.error}. Pastikan atribut JSON valid dan lengkap,` +
                            ' serta atribut fakultas unik'
                    );
                }}
            />
        </>
    );

    return (
        <>
            <Toast ref={toastRef} position="bottom-right" />
            <div style={{ paddingBottom: '32px' }}>
                <Toolbar start={startContent} />
            </div>
        </>
    );
}
