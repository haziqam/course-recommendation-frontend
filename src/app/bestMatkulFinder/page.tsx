'use client';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { MatkulTable } from '../matkul/MatkulTable';
import { useToast } from '@/hooks/useToast';
import { AxiosError } from 'axios';
import { useGetAllFakultas } from '@/hooks/useGetAllFakultas';
import { MatkulService } from '@/services/matkul.service';
import sharedStyles from '../shared.module.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';

export default function Page() {
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
    const { toastRef, showSuccess, showError } = useToast();
    const {
        data: fakultasOptions,
        isLoading: isFakultasFetchLoading,
        isError: isFakultasFetchError,
    } = useGetAllFakultas();

    const dataNotFilled = selectedFakultas === null || semester === '';
    const SKSnotFilled = minSKS === '' || maxSKS === '';
    const isSKSvalid = minSKS <= maxSKS;

    const labelStyle = { display: 'block', marginBottom: '8px' };
    const panelStyle = {
        marginBottom: '32px',
        marginLeft: '32px',
        width: '500px',
    };

    const handeFindMatkulClick = async () => {
        setAvailableMatkul([]);
        if (dataNotFilled || semester === '0') return;

        try {
            const availableMatkul = await MatkulService.findAvailable(
                selectedFakultas!.namaFakultas,
                parseInt(semester)
            );
            if (availableMatkul === null) {
                showError(
                    `Tidak menemukan matkul fakultas ${selectedFakultas?.namaFakultas} dengan semester minimum <= ${semester}`
                );
                return;
            }
            setAvailableMatkul(availableMatkul);
            showSuccess('Matkul berhasil ditemukan');
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data.error;
                showError(
                    `Terjadi kesalahan dalam menemukan matkul: ${errorMsg}`
                );
            }
        }
    };

    const handleFindBestMatkulClick = async () => {
        setBestMatkul([]);
        setBestMatkulIP(-1);
        setBestMatkulSKS(0);
        if (!isSKSvalid) {
            showError('Masukan SKS tidak valid');
            return;
        }

        try {
            const bestMatkul = await MatkulService.findBestOption(
                selectedFakultas!.namaFakultas,
                parseInt(semester),
                parseInt(minSKS),
                parseInt(maxSKS)
            );

            if (bestMatkul.bestOptions === null) {
                showError(
                    'Tidak terdapat pilihan matkul terbaik dengan kondisi yang diberikan'
                );
                return;
            }

            setBestMatkul(bestMatkul.bestOptions);
            setBestMatkulIP(bestMatkul.IP);
            setBestMatkulSKS(bestMatkul.SKS);
            showSuccess('Berhasil menemukan pilihan matkul terbaik');
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data.error;
                showError(
                    `Terjadi kesalahan dalam menemukan matkul terbaik: ${errorMsg}`
                );
            }
        }
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
                    disabled={dataNotFilled || semester === '0'}
                    onClick={handeFindMatkulClick}
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
                    disabled={dataNotFilled || semester === '0' || SKSnotFilled}
                    style={{ display: 'block' }}
                    onClick={handleFindBestMatkulClick}
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
