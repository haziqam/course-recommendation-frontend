import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export function MatkulTable(props: { allMatkul: Matkul[] | undefined }) {
  return (
    <div>
      <DataTable value={props.allMatkul} sortMode="multiple">
        <Column field="namaJurusan" header="Nama Jurusan" sortable></Column>
        <Column field="namaMatkul" header="Nama Matkul"></Column>
        <Column field="minSemester" header="Semester Minimum" sortable></Column>
        <Column field="sks" header="SKS" sortable></Column>
        <Column field="prediksiIndeks" header="Prediksi Indeks"></Column>
      </DataTable>
    </div>
  );
}
