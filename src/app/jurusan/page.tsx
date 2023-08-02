"use client";
import React, { useEffect, useState } from "react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Navbar } from "@/components/Navbar";
import { updateRender } from "@/util/updateRender";
import { Dropdown } from "primereact/dropdown";
import { fetchAllData } from "@/util/fetchAllData";

export default function page() {
  const [allJurusan, setAllJurusan] = useState<Jurusan[]>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tableRenderHelper, setTableRenderHelper] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAllData("jurusan");
      if (result.success) {
        setAllJurusan(result.data);
      } else {
        console.error("Failed to fetch jurusan:", result.errorMsg);
      }
    };

    fetchData();
  }, [tableRenderHelper]);

  const startContent = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={(e) => {
          setShowAddDialog(true);
        }}
      />
      <FileUpload
        mode="basic"
        name="Jurusan[]"
        url="http://localhost:3000/jurusan/addFromFile"
        accept=".json"
        maxFileSize={1000000}
        auto
        chooseLabel="Batch upload (JSON file)"
        onUpload={(e) => {
          updateRender(tableRenderHelper, setTableRenderHelper);
        }}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Navbar />
      <p>Here's jurusan</p>
      <AddJurusanDialog
        visible={showAddDialog}
        onHide={() => {
          setShowAddDialog(false);
        }}
        onSubmitSuccess={() => {
          updateRender(tableRenderHelper, setTableRenderHelper);
        }}
      />
      <Toolbar start={startContent}></Toolbar>
      <DataTable value={allJurusan}>
        <Column field="namaFakultas" header="Nama Fakultas" sortable></Column>
        <Column field="namaJurusan" header="Nama Jurusan"></Column>
      </DataTable>
    </div>
  );
}

function AddJurusanDialog(props: {
  visible: boolean;
  onHide: () => void;
  onSubmitSuccess: () => void;
}) {
  const [newJurusanName, setNewJurusanName] = useState("");
  const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(
    null
  );
  const [fakultasOptions, setFakultasOptions] = useState<Fakultas[]>([]);

  useEffect(() => {
    setNewJurusanName("");
    setSelectedFakultas(null);
    const fetchData = async () => {
      const fakultasResponse = await fetchAllData("fakultas");
      if (!fakultasResponse.success) {
        alert(`Failed to fetch fakultas options: ${fakultasResponse.errorMsg}`);
        return;
      }
      setFakultasOptions(fakultasResponse.data);
    };
    fetchData();
  }, [props.visible]);

  return (
    <Dialog
      header="Tambahkan jurusan baru"
      visible={props.visible}
      style={{ width: "50vw" }}
      onHide={props.onHide}
      blockScroll
    >
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        <Dropdown
          inputId="selectedFakultas"
          value={selectedFakultas}
          onChange={(e) => setSelectedFakultas(e.value)}
          options={fakultasOptions}
          optionLabel="namaFakultas"
        />
        <label htmlFor="selectedFakultas">Nama Fakultas</label>
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        <InputText
          id="newJurusanName"
          value={newJurusanName}
          onChange={(e) => {
            setNewJurusanName(e.target.value);
          }}
        />
        <label htmlFor="newJurusanName">Nama Jurusan</label>
      </span>
      <Button
        label="Save"
        icon="pi pi-check"
        disabled={newJurusanName === "" || selectedFakultas === null}
        onClick={(e) => {
          const postData = async () => {
            const result = await addJurusan([
              {
                namaJurusan: newJurusanName,
                namaFakultas: selectedFakultas!.namaFakultas,
              },
            ]);
            if (result.success) {
              props.onSubmitSuccess();
            } else {
              console.error("Failed to add matkul:", result.errorMsg);
            }
          };
          postData();
          props.onHide();
        }}
      />
    </Dialog>
  );
}

async function addJurusan(jurusan: Jurusan[]) {
  try {
    const response = await fetch("http://localhost:3000/jurusan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jurusan),
    });
    if (!response.ok) {
      const errorMsg = await response.json();
      return { success: false, errorMsg: errorMsg.error as string };
    }
    return { success: true };
  } catch (error) {
    return { success: false, errorMsg: (error as Error).message };
  }
}
