import { MatkulService } from '@/services/matkul.service';
import { useQuery } from 'react-query';

export function useGetAllMatkul() {
    return useQuery({
        queryFn: MatkulService.getAll,
        queryKey: ['allMatkul'],
        staleTime: 60 * 1000,
    });
}
