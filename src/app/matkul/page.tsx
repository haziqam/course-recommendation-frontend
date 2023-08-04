"use client";
import React, { useEffect, useRef, useState } from "react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { FileUpload } from "primereact/fileupload";
import { Navbar } from "@/components/Navbar";
import { updateRender } from "@/util/updateRender";
import { fetchAllData } from "@/util/fetchAllData";
import { MatkulTable } from "./MatkulTable";
import { Toast } from "primereact/toast";
import { showError, showSuccess } from "@/util/toastFunctions";
import sharedStyles from "../shared.module.css";
import { AddMatkulDialog } from "./AddMatkulDialog";

export default function Page() {
  const [allMatkul, setAllMatkul] = useState<Matkul[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tableRenderHelper, setTableRenderHelper] = useState(false);
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAllData("matkul");
      if (!result.success) {
        console.error("Failed to fetch matkul:", result.errorMsg);
        return;
      }
      setAllMatkul(result.data);
    };

    fetchData();
  }, [tableRenderHelper]);

  const toolbarContent = (
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
        name="Matkul[]"
        url="http://localhost:5000/matkul/addFromFile"
        accept=".json"
        maxFileSize={1000000}
        auto
        chooseLabel="Batch upload (JSON file)"
        onUpload={(e) => {
          showSuccess(toastRef, "Berhasil menambahkan matkul");
          updateRender(tableRenderHelper, setTableRenderHelper);
        }}
        onError={(e) => {
          const response = JSON.parse(e.xhr.response);
          showError(
            toastRef,
            `Gagal menambahkan matkul: ${response.error}. Pastikan atribut JSON valid dan lengkap,` +
              " namaMatkul harus unik terhadap namaJurusan, serta namaJurusan" +
              " tersedia pada tabel jurusan"
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
      <AddMatkulDialog
        visible={showAddDialog}
        onHide={() => {
          setShowAddDialog(false);
        }}
        onSubmitSuccess={() => {
          updateRender(tableRenderHelper, setTableRenderHelper);
        }}
        toastRef={toastRef}
      />
      <div className={sharedStyles.tableStyle}>
        <div style={{ paddingBottom: "32px" }}>
          <Toolbar start={toolbarContent} />
        </div>
        <MatkulTable
          allMatkul={allMatkul}
          isDeletable={true}
          onModify={() => {
            updateRender(tableRenderHelper, setTableRenderHelper);
          }}
        />
      </div>
    </div>
  );
}
