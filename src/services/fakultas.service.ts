import axiosInstance from '../lib/axios';

const baseUri = '/fakultas';

export class FakultasService {
    static async getAll() {
        const response = await axiosInstance.get<Fakultas[]>(baseUri);
        return response.data;
    }

    static async add(fakultas: Fakultas[]) {
        const response = await axiosInstance.post(baseUri, fakultas);
        return response.data;
    }

    static async update(oldFakultasName: string, newData: Fakultas) {
        const response = await axiosInstance.put(baseUri, {
            oldFakultasName: oldFakultasName,
            newFakultasName: newData.namaFakultas,
        });
        return response.data;
    }

    static async remove(fakultas: Fakultas) {
        const uri = `${baseUri}?fakultas=${fakultas.namaFakultas}`;
        const encodedUri = encodeURI(uri);
        const response = await axiosInstance.delete(encodedUri);
        return response.data;
    }
}
