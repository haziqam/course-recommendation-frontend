import axiosInstance from '../lib/axios';

const baseUri = '/jurusan';

export class JurusanService {
    static async getAll() {
        const response = await axiosInstance.get<Jurusan[]>(baseUri);
        return response.data;
    }

    static async add(jurusan: Jurusan[]) {
        const data = JSON.stringify(jurusan);
        const response = await axiosInstance.post(baseUri, data);
        return response.data;
    }

    static async update(oldJurusanName: string, newData: Partial<Jurusan>) {
        const data = {
            oldJurusanName,
            newJurusanName: newData.namaJurusan,
            newFakultasName: newData.namaFakultas,
        };
        const response = await axiosInstance.patch(baseUri, data);
        return response.data;
    }

    static async remove(jurusan: Jurusan) {
        const uri = `${baseUri}?jurusan=${jurusan.namaJurusan}`;
        const encodedUri = encodeURI(uri);
        const response = await axiosInstance.delete(encodedUri);
        return response.data;
    }
}
