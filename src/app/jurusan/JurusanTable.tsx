import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export function JurusanTable(props: {
    allJurusan: Jurusan[];
    onDeleteJurusan: (jurusan: Jurusan) => void;
}) {
    const { allJurusan, onDeleteJurusan } = props;
    const actionBodyTemplate = (rowData: Jurusan) => {
        return (
            <>
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => onDeleteJurusan(rowData)}
                />
            </>
        );
    };

    return (
        <DataTable
            value={allJurusan}
            sortMode="multiple"
            removableSort
            showGridlines
        >
            <Column
                field="namaFakultas"
                header="Nama Fakultas"
                sortable
            ></Column>
            <Column field="namaJurusan" header="Nama Jurusan" sortable></Column>
            <Column
                header="Actions"
                body={actionBodyTemplate}
                exportable={false}
            ></Column>
        </DataTable>
    );
}
