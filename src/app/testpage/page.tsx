'use client';
import { useGetAllFakultas } from '@/hooks/useGetAllFakultas';

export default function Page() {
    const { data } = useGetAllFakultas();
    console.log(data);
    return (
        <div>
            {data &&
                data.map((fakultas, index) => (
                    <li key={index}>{fakultas.namaFakultas}</li>
                ))}
        </div>
    );
}
