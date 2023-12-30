import axiosInstance from '../lib/axios';

const baseUri = '/matkul';

export class MatkulService {
    static async getAll() {
        const response = await axiosInstance.get<Matkul[]>(baseUri);
        return response.data;
    }

    static async add(matkul: Matkul[]) {
        const response = await axiosInstance.post(baseUri, matkul);
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
        const uri = `${baseUri}?matkul=${matkul.namaMatkul}&jurusan=${matkul.namaJurusan}`;
        const encodedUri = encodeURI(uri);
        const response = await axiosInstance.delete(encodedUri);
        return response.data;
    }

    static async findAvailable(fakultasName: string, semester: number) {
        const uri = `${baseUri}/find?fakultas=${fakultasName}&semester=${semester}`;
        const encodedUri = encodeURI(uri);
        const response = await axiosInstance.get(encodedUri);
        return response.data;
    }

    static async findBestOption(
        fakultasName: string,
        semester: number,
        minSKS: number,
        maxSKS: number
    ) {
        const uri = `${baseUri}/find/bestOptions?fakultas=${fakultasName}&semester=${semester}&minSKS=${minSKS}&maxSKS=${maxSKS}`;
        const encodedUri = encodeURI(uri);
        const response = await axiosInstance.get(encodedUri);
        return response.data;
    }
}
