import { useGetAllJurusan } from '@/hooks/useGetAllJurusan';
import { useToast } from '@/hooks/useToast';
import { MatkulService } from '@/services/matkul.service';
import { fetchAllData } from '@/util/fetchAllData';
import { showError, showSuccess } from '@/util/toastFunctions';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DropdownProps, Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';

export function AddMatkulDialog(props: {
    visible: boolean;
    onHide: () => void;
}) {
    const { visible, onHide } = props;
    const { data: jurusanOptions, isLoading, isError } = useGetAllJurusan();
    const [newMatkulName, setNewMatkulName] = useState('');
    const [newMatkulSKS, setNewMatkulSKS] = useState('');
    const [newMatkulMinSemester, setNewMatkulMinSemester] = useState('');
    const [newMatkulPrediksiIndeks, setNewMatkulPrediksiIndeks] = useState('');
    const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(
        null
    );
    const { toastRef, showSuccess, showError } = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: MatkulService.add,
        onSuccess: () => {
            showSuccess('Berhasil menambahkan matkul');
            queryClient.invalidateQueries(['allMatkul']);
            onHide();
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data.error;
                showError(
                    `Gagal menambahkan matkul: ${errorMsg}. Pastikan data valid, ` +
                        'nama matkul unik terhadap nama jurusan, serta nama jurusan teredia ' +
                        'pada tabel jurusan'
                );
                onHide();
            }
        },
    });
    const resetFormData = () => {
        setNewMatkulName('');
        setNewMatkulSKS('');
        setNewMatkulMinSemester('');
        setNewMatkulPrediksiIndeks('');
        setSelectedJurusan(null);
    };

    useEffect(() => {
        resetFormData();
    }, [props.visible]);

    const dataNotFilled =
        newMatkulName === '' ||
        selectedJurusan === null ||
        newMatkulSKS === '' ||
        newMatkulMinSemester === '' ||
        newMatkulPrediksiIndeks === '';

    return (
        <>
            <Toast ref={toastRef} position="bottom-right" />
            <Dialog
                header="Tambahkan matkul baru"
                visible={visible}
                style={{ width: '40vw' }}
                onHide={onHide}
                blockScroll
                pt={{ header: { style: { paddingBottom: '0' } } }}
            >
                <span className="p-float-label" style={{ marginTop: '24px' }}>
                    <Dropdown
                        inputId="selectedJurusan"
                        pt={{ root: { style: { width: '300px' } } }}
                        value={selectedJurusan}
                        onChange={(e) => setSelectedJurusan(e.value)}
                        options={jurusanOptions}
                        optionLabel="namaJurusan"
                        placeholder="Nama Jurusan"
                        filter
                        valueTemplate={selectedJurusanTemplate}
                        itemTemplate={jurusanOptionTemplate}
                    />
                    <label htmlFor="selectedJurusan">Nama Jurusan</label>
                </span>
                <span className="p-float-label" style={{ marginTop: '24px' }}>
                    <InputText
                        id="newMatkulName"
                        pt={{ root: { style: { width: '300px' } } }}
                        value={newMatkulName}
                        onChange={(e) => {
                            setNewMatkulName(e.target.value);
                        }}
                    />
                    <label htmlFor="newMatkulName">Nama Matkul</label>
                </span>
                <span className="p-float-label" style={{ marginTop: '24px' }}>
                    <InputText
                        id="newMatkulMinSemester"
                        pt={{ root: { style: { width: '300px' } } }}
                        value={newMatkulMinSemester}
                        keyfilter="pint"
                        onChange={(e) => {
                            setNewMatkulMinSemester(e.target.value);
                        }}
                    />
                    <label htmlFor="newMatkulMinSemester">
                        Semester Minimum Pengambilan
                    </label>
                </span>
                <span className="p-float-label" style={{ marginTop: '24px' }}>
                    <InputText
                        id="newMatkulSKS"
                        pt={{ root: { style: { width: '300px' } } }}
                        value={newMatkulSKS}
                        keyfilter="pint"
                        onChange={(e) => {
                            setNewMatkulSKS(e.target.value);
                        }}
                    />
                    <label htmlFor="newMatkulSKS">SKS</label>
                </span>
                <span className="p-float-label" style={{ marginTop: '24px' }}>
                    <Dropdown
                        inputId="newMatkulPrediksiIndeks"
                        pt={{ root: { style: { width: '300px' } } }}
                        value={newMatkulPrediksiIndeks}
                        onChange={(e) => setNewMatkulPrediksiIndeks(e.value)}
                        options={['A', 'AB', 'B', 'BC', 'C', 'D', 'E']}
                        placeholder="Prediksi Indeks"
                    />
                    <label htmlFor="newMatkulPrediksiIndeks">
                        Prediksi Indeks
                    </label>
                </span>
                <Button
                    label="Save"
                    icon="pi pi-check"
                    disabled={dataNotFilled}
                    pt={{ root: { style: { marginTop: '24px' } } }}
                    onClick={() => {
                        mutation.mutate([
                            {
                                namaMatkul: newMatkulName,
                                namaJurusan: selectedJurusan?.namaJurusan!,
                                minSemester: parseInt(newMatkulMinSemester),
                                sks: parseInt(newMatkulSKS),
                                prediksiIndeks: newMatkulPrediksiIndeks,
                            },
                        ]);
                    }}
                />
            </Dialog>
        </>
    );
}

function selectedJurusanTemplate(option: Jurusan, props: DropdownProps) {
    if (option) {
        return <div>{option.namaJurusan}</div>;
    }
    return <span>{props.placeholder}</span>;
}

function jurusanOptionTemplate(option: Jurusan) {
    return (
        <div className="flex align-items-center">
            <div>{option.namaJurusan}</div>
        </div>
    );
}
