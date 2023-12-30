import { JurusanService } from '@/services/jurusan.service';
import { useQuery } from 'react-query';

export function useGetAllJurusan() {
    return useQuery({
        queryFn: JurusanService.getAll,
        queryKey: ['allJurusan'],
        staleTime: 60 * 1000,
    });
}
