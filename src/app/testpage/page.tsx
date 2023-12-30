'use client';
import { useGetAllFakultas } from '@/hooks/useGetAllFakultas';
import { useState, ChangeEvent, useEffect } from 'react';

export default function Page() {
    const [newMatkulData, setNewMatkulData] = useState<Partial<Matkul>>({});
    const handleFormInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === '') {
            setNewMatkulData((prev) => ({
                ...prev,
                [name as keyof Matkul]: undefined,
            }));
        } else {
            const convertedValue =
                typeof matkulExample[name as keyof Matkul] === 'number'
                    ? parseInt(value)
                    : value;

            setNewMatkulData((prev) => ({
                ...prev,
                [name as keyof Matkul]: convertedValue,
            }));
        }
    };

    useEffect(() => {
        console.log(newMatkulData);
    }, [newMatkulData]);

    return (
        <div>
            <label style={{ display: 'block' }}>Min semester</label>
            <input
                type="text"
                name="minSemester"
                value={newMatkulData.minSemester || ''}
                onChange={handleFormInputChange}
            />
            <label style={{ display: 'block' }}>Nama Jurusan</label>
            <input
                type="text"
                name="namaJurusan"
                value={newMatkulData.namaJurusan || ''}
                onChange={handleFormInputChange}
            />
            <label style={{ display: 'block' }}>Nama matkul</label>
            <input
                type="text"
                name="namaMatkul"
                value={newMatkulData.namaMatkul || ''}
                onChange={handleFormInputChange}
            />
            <label style={{ display: 'block' }}>Prediksi Indeks</label>
            <input
                type="text"
                name="prediksiIndeks"
                value={newMatkulData.prediksiIndeks || ''}
                onChange={handleFormInputChange}
            />
            <label style={{ display: 'block' }}>SKS</label>
            <input
                type="text"
                name="sks"
                value={newMatkulData.sks || ''}
                onChange={handleFormInputChange}
            />
        </div>
    );
}

const matkulExample: Matkul = {
    namaMatkul: 'Stima',
    sks: 3,
    namaJurusan: 'IF',
    minSemester: 4,
    prediksiIndeks: 'A',
} as const;
