import { fetchAllData } from '@/util/fetchAllData';
import { showError, showSuccess } from '@/util/toastFunctions';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DropdownProps, Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useState, useEffect } from 'react';

export function AddMatkulDialog(props: {
    visible: boolean;
    onHide: () => void;
    onSubmitSuccess: () => void;
    toastRef: React.RefObject<Toast>;
}) {
    const [newMatkulName, setNewMatkulName] = useState('');
    const [newMatkulSKS, setNewMatkulSKS] = useState('');
    const [newMatkulMinSemester, setNewMatkulMinSemester] = useState('');
    const [newMatkulPrediksiIndeks, setNewMatkulPrediksiIndeks] = useState('');
    const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(
        null
    );
    const [jurusanOptions, setJurusanOptions] = useState<Jurusan[]>([]);

    const resetFormData = () => {
        setNewMatkulName('');
        setNewMatkulSKS('');
        setNewMatkulMinSemester('');
        setNewMatkulPrediksiIndeks('');
        setSelectedJurusan(null);
    };

    useEffect(() => {
        resetFormData();
        const fetchData = async () => {
            const jurusanResponse = await fetchAllData('jurusan');
            if (!jurusanResponse.success) {
                alert(
                    `Failed to fetch jurusan options: ${jurusanResponse.errorMsg}`
                );
                return;
            }
            setJurusanOptions(jurusanResponse.data);
        };
        fetchData();
    }, [props.visible]);

    const selectedJurusanTemplate = (option: Jurusan, props: DropdownProps) => {
        if (option) {
            return <div>{option.namaJurusan}</div>;
        }
        return <span>{props.placeholder}</span>;
    };

    const jurusanOptionTemplate = (option: Jurusan) => {
        return (
            <div className="flex align-items-center">
                <div>{option.namaJurusan}</div>
            </div>
        );
    };

    const dataNotFilled = () => {
        return (
            newMatkulName === '' ||
            selectedJurusan === null ||
            newMatkulSKS === '' ||
            newMatkulMinSemester === '' ||
            newMatkulPrediksiIndeks === ''
        );
    };

    return (
        <Dialog
            header="Tambahkan matkul baru"
            visible={props.visible}
            style={{ width: '40vw' }}
            onHide={props.onHide}
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
                <label htmlFor="newMatkulPrediksiIndeks">Prediksi Indeks</label>
            </span>
            <Button
                label="Save"
                icon="pi pi-check"
                disabled={dataNotFilled()}
                pt={{ root: { style: { marginTop: '24px' } } }}
                onClick={(e) => {
                    const postData = async () => {
                        const result = await addMatkul([
                            {
                                namaMatkul: newMatkulName,
                                namaJurusan: selectedJurusan!.namaJurusan,
                                sks: parseInt(newMatkulSKS),
                                minSemester: parseInt(newMatkulMinSemester),
                                prediksiIndeks: newMatkulPrediksiIndeks,
                            },
                        ]);
                        if (!result.success) {
                            showError(
                                props.toastRef,
                                `Gagal menambahkan matkul: ${result.errorMsg}. Pastikan data valid, ` +
                                    'nama matkul unik terhadap nama jurusan, serta nama jurusan teredia ' +
                                    'pada tabel jurusan'
                            );
                            return;
                        }
                        showSuccess(
                            props.toastRef,
                            'Berhasil menambahkan matkul'
                        );
                        props.onSubmitSuccess();
                    };
                    postData();
                    props.onHide();
                }}
            />
        </Dialog>
    );
}

async function addMatkul(matkul: Matkul[]) {
    try {
        const response = await fetch('http://localhost:5000/matkul', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matkul),
        });
        if (!response.ok) {
            const errorMsg = await response.json();
            return { success: false, errorMsg: errorMsg.error as string };
        }
        return { success: true };
    } catch (error) {
        return { success: false, errorMsg: (error as Error).message };
    }
}
