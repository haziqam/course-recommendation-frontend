"use client";
import React, { useEffect, useRef, useState } from "react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Navbar } from "@/components/Navbar";
import { updateRender } from "@/util/updateRender";
import { fetchAllData } from "@/util/fetchAllData";
import { Toast } from "primereact/toast";
import { showError, showSuccess } from "@/util/toastFunctions";
import { AddFakultasDialog } from "./AddFakultasDialog";
import sharedStyles from "../shared.module.css";

export default function Page() {
  const [allFakultas, setAllFakultas] = useState<Fakultas[]>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tableRenderHelper, setTableRenderHelper] = useState(false);
  const [fakultasToDelete, setFakultasToDelete] = useState<Fakultas | null>(
    null
  );
  const [showDeleteFakultasDialog, setShowDeleteFakultasDialog] =
    useState(false);
  const toastRef = useRef<Toast>(null);

  const hideDeleteFakultasDialog = () => {
    setShowDeleteFakultasDialog(false);
  };

  const confirmDeleteFakultas = (fakultas: Fakultas) => {
    setFakultasToDelete(fakultas);
    setShowDeleteFakultasDialog(true);
  };

  const deleteFakultas = async () => {
    const result = await removeFakultas(fakultasToDelete!);
    if (!result.success) {
      showError(toastRef, `Gagal menghapus fakultas: ${result.errorMsg}`);
    } else {
      showSuccess(toastRef, "Fakultas berhasil dihapus");
    }
    hideDeleteFakultasDialog();
    setFakultasToDelete(null);
    updateRender(tableRenderHelper, setTableRenderHelper);
  };

  const deleteFakultasDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteFakultasDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteFakultas}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData: Fakultas) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteFakultas(rowData)}
        />
      </React.Fragment>
    );
  };

  const DeleteFakultasDialog = () => {
    return (
      <Dialog
        visible={showDeleteFakultasDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteFakultasDialogFooter}
        onHide={hideDeleteFakultasDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {fakultasToDelete && (
            <span
              style={{
                marginLeft: "16px",
                position: "relative",
                bottom: "8px",
              }}
            >
              Anda yakin ingin menghapus <b>{fakultasToDelete.namaFakultas}</b>?
            </span>
          )}
        </div>
      </Dialog>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAllData("fakultas");
      if (!result.success) {
        alert(`Failed to fetch fakultas: ${result.errorMsg}`);
        return;
      }
      setAllFakultas(result.data);
    };

    fetchData();
  }, [tableRenderHelper]);

  const startContent = (
    <React.Fragment>
      <Button
        label="New"
        pt={{ root: { style: { marginRight: "16px" } } }}
        icon="pi pi-plus"
        className="mr-2"
        onClick={(e) => {
          setShowAddDialog(true);
        }}
      />
      <FileUpload
        mode="basic"
        name="Fakultas[]"
        url="http://localhost:5000/fakultas/addFromFile"
        accept=".json"
        maxFileSize={1000000}
        auto
        chooseLabel="Batch upload (JSON file)"
        onUpload={(e) => {
          updateRender(tableRenderHelper, setTableRenderHelper);
          showSuccess(toastRef, "Berhasil menambahkan fakultas");
        }}
        onError={(e) => {
          const response = JSON.parse(e.xhr.response);
          showError(
            toastRef,
            `Gagal menambahkan fakultas: ${response.error}. Pastikan atribut JSON valid dan lengkap,` +
              " serta atribut fakultas unik"
          );
        }}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "54px", paddingBottom: "32px" }}></div>
      <Toast ref={toastRef} position="bottom-right" />
      <AddFakultasDialog
        visible={showAddDialog}
        onHide={() => {
          setShowAddDialog(false);
        }}
        onSubmitSuccess={() => {
          updateRender(tableRenderHelper, setTableRenderHelper);
        }}
        toastRef={toastRef}
      />
      <div className={sharedStyles.smallTableStyle}>
        <div style={{ paddingBottom: "32px" }}>
          <Toolbar start={startContent} />
        </div>
        <DeleteFakultasDialog />
        <DataTable value={allFakultas} removableSort showGridlines>
          <Column field="namaFakultas" header="Nama Fakultas" sortable></Column>
          <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
      </div>
    </div>
  );
}

async function removeFakultas(fakultas: Fakultas) {
  const encodedNamaFakultas = encodeURIComponent(fakultas.namaFakultas);
  try {
    const response = await fetch(
      `http://localhost:5000/fakultas?fakultas=${encodedNamaFakultas}`,
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
