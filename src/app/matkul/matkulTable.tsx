import { showError, showSuccess } from "@/util/toastFunctions";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";

export function MatkulTable(props: {
  allMatkul: Matkul[];
  isDeletable: boolean;
  onModify?: () => void;
}) {
  const [matkulToDelete, setMatkulToDelete] = useState<Matkul | null>(null);
  const [showDeleteMatkulDialog, setShowDeleteMatkulDialog] = useState(false);
  const toastRef = useRef<Toast>(null);

  const hideDeleteMatkulDialog = () => {
    setShowDeleteMatkulDialog(false);
  };

  const confirmDeleteMatkul = (matkul: Matkul) => {
    setMatkulToDelete(matkul);
    setShowDeleteMatkulDialog(true);
  };

  const deleteMatkul = async () => {
    const result = await removeMatkul(matkulToDelete!);
    if (!result.success) {
      showError(toastRef, `Gagal menghapus matkul: ${result.errorMsg}`);
    } else {
      showSuccess(toastRef, "Matkul berhasil dihapus");
    }
    hideDeleteMatkulDialog();
    setMatkulToDelete(null);
    if (props.onModify !== undefined) props.onModify();
  };

  const deleteMatkulDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteMatkulDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteMatkul}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData: Matkul) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteMatkul(rowData)}
        />
      </React.Fragment>
    );
  };

  const DeleteMatkulDialog = () => {
    return (
      <Dialog
        visible={showDeleteMatkulDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteMatkulDialogFooter}
        onHide={hideDeleteMatkulDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {matkulToDelete && (
            <span
              style={{
                marginLeft: "16px",
                position: "relative",
                bottom: "8px",
              }}
            >
              Anda yakin ingin menghapus matkul{" "}
              <b>{matkulToDelete.namaMatkul}</b>?
            </span>
          )}
        </div>
      </Dialog>
    );
  };

  return (
    <div>
      {props.isDeletable && <DeleteMatkulDialog />}
      <Toast ref={toastRef} position="bottom-right" />
      <DataTable
        value={props.allMatkul}
        sortMode="multiple"
        removableSort
        showGridlines
      >
        <Column field="namaJurusan" header="Nama Jurusan" sortable></Column>
        <Column field="namaMatkul" header="Nama Matkul"></Column>
        <Column field="minSemester" header="Semester Minimum" sortable></Column>
        <Column field="sks" header="SKS" sortable></Column>
        <Column field="prediksiIndeks" header="Prediksi Indeks"></Column>
        {props.isDeletable && (
          <Column body={actionBodyTemplate} exportable={false}></Column>
        )}
      </DataTable>
    </div>
  );
}

async function removeMatkul(matkul: Matkul) {
  const encodedNamaMatkul = encodeURIComponent(matkul.namaMatkul);
  const encodedNamaJurusan = encodeURIComponent(matkul.namaJurusan);
  try {
    const response = await fetch(
      `http://localhost:5000/matkul?matkul=${encodedNamaMatkul}&jurusan=${encodedNamaJurusan}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorMsg = await response.json();
      return { success: false, errorMsg: errorMsg.error as string };
    }
    return { success: true };
  } catch (error) {
    return { success: false, errorMsg: (error as Error).message };
  }
}
