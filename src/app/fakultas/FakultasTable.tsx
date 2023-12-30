import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export function FakultasTable(props: {
    allFakultas: Fakultas[];
    onDeleteFakultas: (fakultas: Fakultas) => void;
}) {
    const { allFakultas, onDeleteFakultas } = props;
    const actionBodyTemplate = (rowData: Fakultas) => (
        <>
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                onClick={() => onDeleteFakultas(rowData)}
            />
        </>
    );

    return (
        <DataTable value={allFakultas} removableSort showGridlines>
            <Column
                field="namaFakultas"
                header="Nama Fakultas"
                sortable
            ></Column>
            <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
    );
}
