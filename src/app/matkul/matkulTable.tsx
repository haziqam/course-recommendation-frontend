import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export function MatkulTable(props: {
    allMatkul: Matkul[];
    onDeleteMatkul?: (matkul: Matkul) => void;
    isDeletable?: boolean;
}) {
    const { allMatkul, onDeleteMatkul, isDeletable } = props;
    const actionBodyTemplate = (rowData: Matkul) => {
        return (
            <>
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        onDeleteMatkul!(rowData);
                    }}
                />
            </>
        );
    };

    return (
        <DataTable
            value={allMatkul}
            sortMode="multiple"
            removableSort
            showGridlines
        >
            <Column field="namaJurusan" header="Nama Jurusan" sortable></Column>
            <Column field="namaMatkul" header="Nama Matkul"></Column>
            <Column
                field="minSemester"
                header="Semester Minimum"
                sortable
            ></Column>
            <Column field="sks" header="SKS" sortable></Column>
            <Column field="prediksiIndeks" header="Prediksi Indeks"></Column>
            {isDeletable === true ? (
                <Column
                    header="Actions"
                    body={actionBodyTemplate}
                    exportable={false}
                ></Column>
            ) : null}
        </DataTable>
    );
}
