import { JurusanService } from '@/services/jurusan.service';
import { useQuery } from 'react-query';

export function useGetAllFakultas() {
    return useQuery({
        queryFn: JurusanService.getAll,
        queryKey: ['allJurusan'],
        staleTime: 60 * 1000,
    });
}
