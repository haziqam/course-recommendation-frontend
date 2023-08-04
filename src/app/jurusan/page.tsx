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
import { AddJurusanDialog } from "./AddJurusanDialog";
import { showError, showSuccess } from "@/util/toastFunctions";
import { Toast } from "primereact/toast";
import sharedStyles from "../shared.module.css";

export default function Page() {
  const [allJurusan, setAllJurusan] = useState<Jurusan[]>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tableRenderHelper, setTableRenderHelper] = useState(false);
  const [jurusanToDelete, setJurusanToDelete] = useState<Jurusan | null>(null);
  const [showDeleteJurusanDialog, setShowDeleteJurusanDialog] = useState(false);
  const toastRef = useRef<Toast>(null);

  const hideDeleteJurusanDialog = () => {
    setShowDeleteJurusanDialog(false);
  };

  const confirmDeleteJurusan = (jurusan: Jurusan) => {
    setJurusanToDelete(jurusan);
    setShowDeleteJurusanDialog(true);
  };

  const deleteJurusan = async () => {
    const result = await removeJurusan(jurusanToDelete!);
    if (!result.success) {
      showError(toastRef, `Gagal menghapus jurusan: ${result.errorMsg}`);
    } else {
      showSuccess(toastRef, "Jurusan berhasil dihapus");
    }
    hideDeleteJurusanDialog();
    setJurusanToDelete(null);
    updateRender(tableRenderHelper, setTableRenderHelper);
  };

  const deleteJurusanDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteJurusanDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteJurusan}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData: Jurusan) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteJurusan(rowData)}
        />
      </React.Fragment>
    );
  };

  const DeleteJurusanDialog = () => {
    return (
      <Dialog
        visible={showDeleteJurusanDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteJurusanDialogFooter}
        onHide={hideDeleteJurusanDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {jurusanToDelete && (
            <span
              style={{
                marginLeft: "16px",
                position: "relative",
                bottom: "8px",
              }}
            >
              Anda yakin ingin menghapus <b>{jurusanToDelete.namaJurusan}</b>?
            </span>
          )}
        </div>
      </Dialog>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAllData("jurusan");
      if (!result.success) {
        console.error("Failed to fetch jurusan:", result.errorMsg);
        return;
      }
      setAllJurusan(result.data);
    };

    fetchData();
  }, [tableRenderHelper]);

  const startContent = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        pt={{ root: { style: { marginRight: "16px" } } }}
        onClick={(e) => {
          setShowAddDialog(true);
        }}
      />
      <FileUpload
        mode="basic"
        name="Jurusan[]"
        url="http://localhost:5000/jurusan/addFromFile"
        accept=".json"
        maxFileSize={1000000}
        auto
        chooseLabel="Batch upload (JSON file)"
        onUpload={(e) => {
          showSuccess(toastRef, "Berhasil menambahkan jurusan");
          updateRender(tableRenderHelper, setTableRenderHelper);
        }}
        onError={(e) => {
          const response = JSON.parse(e.xhr.response);
          showError(
            toastRef,
            `Gagal menambahkan jurusan: ${response.error}. Pastikan atribut JSON valid dan lengkap,` +
              " namaJurusan harus unik, serta namaFakultas tersedia pada tabel fakultas"
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
      <AddJurusanDialog
        visible={showAddDialog}
        onHide={() => {
          setShowAddDialog(false);
        }}
        onSubmitSuccess={() => {
          updateRender(tableRenderHelper, setTableRenderHelper);
          showSuccess(toastRef, "Berhasil menambahkan jurusan");
        }}
      />
      <div className={sharedStyles.mediumTableStyle}>
        <div style={{ paddingBottom: "32px" }}>
          <Toolbar start={startContent}></Toolbar>
        </div>
        <DeleteJurusanDialog />
        <DataTable
          value={allJurusan}
          sortMode="multiple"
          removableSort
          showGridlines
        >
          <Column field="namaFakultas" header="Nama Fakultas" sortable></Column>
          <Column field="namaJurusan" header="Nama Jurusan" sortable></Column>
          <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
      </div>
    </div>
  );
}

async function removeJurusan(jurusan: Jurusan) {
  const encodedNamaJurusan = encodeURIComponent(jurusan.namaJurusan);
  try {
    const response = await fetch(
      `http://localhost:5000/jurusan?jurusan=${encodedNamaJurusan}`,
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
