export async function fetchAllData(
    entityName: 'fakultas' | 'jurusan' | 'matkul'
) {
    try {
        const response = await fetch('http://localhost:5000/' + entityName);
        const allData = await response.json();
        if (!response.ok) {
            return { success: false, errorMsg: allData.error };
        }
        return { success: true, data: allData };
    } catch (error) {
        return { success: false, errorMsg: (error as Error).message };
    }
}
