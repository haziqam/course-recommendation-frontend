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

interface Fakultas {
  namaFakultas: string;
}

export default function page() {
  const [allFakultas, setAllFakultas] = useState<Fakultas[]>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [renderHelper, setRenderHelper] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAllFakultas();
      if (result.success) {
        setAllFakultas(result.fakultasData);
      } else {
        console.error("Failed to fetch fakultas:", result.errorMsg);
      }
    };

    fetchData();
  }, [renderHelper]);

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
        name="Fakultas[]"
        url="http://localhost:3000/fakultas/addFromFile"
        accept=".json"
        maxFileSize={1000000}
        auto
        chooseLabel="Batch upload (JSON file)"
        onUpload={(e) => {
          setRenderHelper(!renderHelper);
        }}
      />
    </React.Fragment>
  );

  return (
    <div>
      <p>Here's fakultas</p>
      <AddFakultasDialog
        visible={showAddDialog}
        onHide={() => {
          setShowAddDialog(false);
        }}
        onSubmitSuccess={(newFakultas: Fakultas) => {
          setRenderHelper(!renderHelper);
        }}
      />
      <Toolbar start={startContent}></Toolbar>
      <DataTable value={allFakultas}>
        <Column field="namaFakultas" header="Nama Fakultas"></Column>
      </DataTable>
    </div>
  );
}

async function fetchAllFakultas() {
  try {
    const response = await fetch("http://localhost:3000/fakultas");
    const allFakultas = await response.json();
    if (!response.ok) {
      return { success: false, errorMsg: allFakultas.error };
    }
    console.log(allFakultas);
    return { success: true, fakultasData: allFakultas };
  } catch (error) {
    return { success: false, errorMsg: (error as Error).message };
  }
}

function AddFakultasDialog(props: {
  visible: boolean;
  onHide: () => void;
  onSubmitSuccess: (newFakultas: Fakultas) => void;
}) {
  const [newFakultasName, setNewFakultasName] = useState("");
  return (
    <Dialog
      header="Tambahkan fakultas baru"
      visible={props.visible}
      style={{ width: "50vw" }}
      onHide={props.onHide}
    >
      <InputText
        value={newFakultasName}
        onChange={(e) => {
          setNewFakultasName(e.target.value);
        }}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        disabled={newFakultasName === ""}
        onClick={(e) => {
          const postData = async () => {
            const result = await addFakultas([
              { namaFakultas: newFakultasName },
            ]);
            if (result.success) {
              props.onSubmitSuccess({ namaFakultas: newFakultasName });
            } else {
              console.error("Failed to fetch fakultas:", result.errorMsg);
            }
          };
          postData();
          props.onHide();
        }}
      />
    </Dialog>
  );
}

async function addFakultas(fakultas: Fakultas[]) {
  try {
    const response = await fetch("http://localhost:3000/fakultas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fakultas),
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
