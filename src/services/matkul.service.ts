import axiosInstance from '../lib/axios';

const baseUri = '/matkul';

export class MatkulService {
    static async getAll() {
        const response = await axiosInstance.get<Matkul[]>(baseUri);
        return response.data;
    }

    static async add(matkul: Matkul[]) {
        const data = JSON.stringify(matkul);
        const response = await axiosInstance.post(baseUri, data);
        return response.data;
    }

    static async update(oldJurusanName: string, newData: Partial<Matkul>) {
        const data = {
            oldJurusanName,
            newMatkulName: newData.namaMatkul,
            newMatkulJurusan: newData.namaJurusan,
            newMatkulSKS: newData.sks,
            newMatkulMinSemester: newData.minSemester,
            newMatkulPrediksiIndeks: newData.prediksiIndeks,
        };
        const response = await axiosInstance.patch(baseUri, data);
        return response.data;
    }

    static async remove(matkul: Matkul) {
        const uri = `${baseUri}?matkul=${matkul.namaJurusan}`;
        const encodedUri = encodeURI(uri);
        const response = await axiosInstance.delete(encodedUri);
        return response.data;
    }
}
