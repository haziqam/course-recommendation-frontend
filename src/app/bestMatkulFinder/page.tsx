'use client';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';
import { fetchAllData } from '@/util/fetchAllData';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { showError, showSuccess } from '@/util/toastFunctions';
import sharedStyles from '../shared.module.css';
import { MatkulTable } from '../matkul/matkulTable';

export default function Page() {
    const [fakultasOptions, setFakultasOptions] = useState<Fakultas[]>([]);
    const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(
        null
    );
    const [semester, setSemester] = useState('');
    const [minSKS, setMinSKS] = useState('');
    const [maxSKS, setMaxSKS] = useState('');
    const [availableMatkul, setAvailableMatkul] = useState<Matkul[]>([]);
    const [bestMatkul, setBestMatkul] = useState<Matkul[]>([]);
    const [bestMatkulIP, setBestMatkulIP] = useState(-1);
    const [bestMatkulSKS, setBestMatkulSKS] = useState(0);
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        const fetchData = async () => {
            const fakultasResponse = await fetchAllData('fakultas');
            if (!fakultasResponse.success) {
                alert(
                    `Failed to fetch fakultas options: ${fakultasResponse.errorMsg}`
                );
                return;
            }
            setFakultasOptions(fakultasResponse.data);
        };
        fetchData();
    }, []);

    const dataNotFilled = () => selectedFakultas === null || semester === '';
    const SKSnotFilled = () => minSKS === '' || maxSKS === '';
    const isSKSvalid = () => minSKS <= maxSKS;

    const labelStyle = { display: 'block', marginBottom: '8px' };
    const panelStyle = {
        marginBottom: '32px',
        marginLeft: '32px',
        width: '500px',
    };

    return (
        <div>
            <Toast ref={toastRef} position="bottom-right" />
            <Panel header="Cari matkul" style={panelStyle}>
                <div>
                    <label htmlFor="namaFakultas" style={labelStyle}>
                        Fakultas
                    </label>
                    <Dropdown
                        inputId="namaFakultas"
                        pt={{ root: { style: { width: '211px' } } }}
                        value={selectedFakultas}
                        options={fakultasOptions}
                        optionLabel="namaFakultas"
                        onChange={(e) => {
                            setSelectedFakultas(e.value);
                        }}
                    />
                </div>
                <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                    <label htmlFor="semester" style={labelStyle}>
                        Semester saat ini
                    </label>
                    <InputText
                        id="semester"
                        value={semester}
                        keyfilter="pint"
                        onChange={(e) => {
                            setSemester(e.target.value);
                        }}
                    />
                </div>
                <Button
                    label="Lihat matkul yang tersedia"
                    style={{ display: 'block' }}
                    disabled={dataNotFilled() || semester === '0'}
                    onClick={async (e) => {
                        setAvailableMatkul([]);
                        if (dataNotFilled() || semester === '0') return;
                        const result = await findAvailableMatkul(
                            selectedFakultas!.namaFakultas,
                            parseInt(semester)
                        );
                        if (!result.success) {
                            showError(toastRef, result.errorMsg!);
                            return;
                        }
                        if (result.availableMatkul === null) {
                            showError(
                                toastRef,
                                `Tidak menemukan matkul fakultas ${selectedFakultas?.namaFakultas} dengan semester minimum <= ${semester}`
                            );
                            return;
                        }
                        setAvailableMatkul(result.availableMatkul!);
                        showSuccess(toastRef, 'Matkul berhasil ditemukan');
                    }}
                />
            </Panel>
            <div className={sharedStyles.tableStyle}>
                <MatkulTable allMatkul={availableMatkul} isDeletable={false} />
            </div>
            <Panel header="Informasi SKS" style={panelStyle}>
                <div>
                    <label htmlFor="minSKS" style={labelStyle}>
                        SKS minimum yang dapat diambil
                    </label>
                    <InputText
                        pt={{ root: { style: { width: '100px' } } }}
                        id="minSKS"
                        value={minSKS}
                        keyfilter="pint"
                        onChange={(e) => {
                            setMinSKS(e.target.value);
                        }}
                    />
                </div>
                <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                    <label htmlFor="maxSKS" style={labelStyle}>
                        SKS maksimum yang dapat diambil
                    </label>
                    <InputText
                        pt={{ root: { style: { width: '100px' } } }}
                        id="maxSKS"
                        value={maxSKS}
                        keyfilter="pint"
                        onChange={(e) => {
                            setMaxSKS(e.target.value);
                        }}
                    />
                </div>
                <Button
                    label="Cari pilihan matkul terbaik"
                    disabled={
                        dataNotFilled() || semester === '0' || SKSnotFilled()
                    }
                    style={{ display: 'block' }}
                    onClick={async (e) => {
                        setBestMatkul([]);
                        setBestMatkulIP(-1);
                        setBestMatkulSKS(0);
                        if (!isSKSvalid) {
                            showError(toastRef, 'Masukan SKS tidak valid');
                            return;
                        }
                        const result = await findBestMatkul(
                            selectedFakultas!.namaFakultas,
                            parseInt(semester),
                            parseInt(minSKS),
                            parseInt(maxSKS)
                        );

                        if (!result.success) {
                            showError(toastRef, result.errorMsg!);
                            return;
                        }
                        setBestMatkul(result.bestMatkul!);
                        setBestMatkulIP(result.bestMatkulIP!);
                        setBestMatkulSKS(result.bestMatkulSKS!);
                        showSuccess(
                            toastRef,
                            'Berhasil menemukan pilihan matkul terbaik'
                        );
                    }}
                />
            </Panel>
            <div className={sharedStyles.tableStyle}>
                <MatkulTable allMatkul={bestMatkul} isDeletable={false} />
            </div>
            <Panel header="Prediksi" style={panelStyle}>
                <div style={{ padding: '8px 0' }}>
                    <b>IP : </b>
                    <span>{bestMatkulIP === -1 ? '-' : bestMatkulIP}</span>
                </div>
                <div style={{ padding: '8px 0' }}>
                    <b>SKS : </b>
                    <span>{bestMatkulSKS === 0 ? '-' : bestMatkulSKS}</span>
                </div>
            </Panel>
        </div>
    );
}

async function findAvailableMatkul(namaFakultas: string, semester: number) {
    try {
        const encodedNamaFakultas = encodeURIComponent(namaFakultas);
        const response = await fetch(
            `http://localhost:5000/matkul/find?fakultas=${encodedNamaFakultas}&semester=${semester}`
        );

        if (!response.ok) {
            const errorMsg = await response.json();
            return { success: false, errorMsg: errorMsg.error as string };
        }

        const availableMatkul = await response.json();
        return { success: true, availableMatkul: availableMatkul as Matkul[] };
    } catch (error) {
        return { success: false, errorMsg: (error as Error).message };
    }
}

async function findBestMatkul(
    namaFakultas: string,
    semester: number,
    minSKS: number,
    maxSKS: number
) {
    try {
        const encodedNamaFakultas = encodeURIComponent(namaFakultas);
        const response = await fetch(
            `http://localhost:5000/matkul/find/bestOptions?fakultas=${encodedNamaFakultas}&semester=${semester}&minSKS=${minSKS}&maxSKS=${maxSKS}`
        );

        if (!response.ok) {
            const errorMsg = await response.json();
            return { success: false, errorMsg: errorMsg.error as string };
        }

        const result = (await response.json()) as BestMatkulData;
        return {
            success: true,
            bestMatkul: result.bestOptions,
            bestMatkulIP: result.IP,
            bestMatkulSKS: result.SKS,
        };
    } catch (error) {
        return { success: false, errorMsg: (error as Error).message };
    }
}
