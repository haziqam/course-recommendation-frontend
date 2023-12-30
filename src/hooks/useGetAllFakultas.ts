import { FakultasService } from '@/services/fakultas.service';
import { useQuery } from 'react-query';

export function useGetAllFakultas() {
    return useQuery({
        queryFn: FakultasService.getAll,
        queryKey: ['allFakultas'],
        staleTime: 60 * 1000,
    });
}
