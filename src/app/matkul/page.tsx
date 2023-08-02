"use client";
import React, { useEffect, useState } from "react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Navbar } from "@/components/Navbar";
import { updateRender } from "@/util/updateRender";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { fetchAllData } from "@/util/fetchAllData";
import { MatkulTable } from "./matkulTable";

export default function page() {
  const [allMatkul, setAllMatkul] = useState<Matkul[]>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tableRenderHelper, setTableRenderHelper] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAllData("matkul");
      if (result.success) {
        setAllMatkul(result.data);
      } else {
        console.error("Failed to fetch matkul:", result.errorMsg);
      }
    };

    fetchData();
  }, [tableRenderHelper]);

  const toolbarContent = (
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
        name="Matkul[]"
        url="http://localhost:3000/matkul/addFromFile"
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
      <p>Here's matkul</p>
      <AddMatkulDialog
        visible={showAddDialog}
        onHide={() => {
          setShowAddDialog(false);
        }}
        onSubmitSuccess={() => {
          updateRender(tableRenderHelper, setTableRenderHelper);
        }}
      />
      <Toolbar start={toolbarContent}></Toolbar>
      <MatkulTable allMatkul={allMatkul} />
      {/* <DataTable value={allMatkul} sortMode="multiple">
        <Column field="namaJurusan" header="Nama Jurusan" sortable></Column>
        <Column field="namaMatkul" header="Nama Matkul"></Column>
        <Column field="minSemester" header="Semester Minimum" sortable></Column>
        <Column field="sks" header="SKS" sortable></Column>
        <Column field="prediksiIndeks" header="Prediksi Indeks"></Column>
      </DataTable> */}
    </div>
  );
}

function AddMatkulDialog(props: {
  visible: boolean;
  onHide: () => void;
  onSubmitSuccess: () => void;
}) {
  const [newMatkulName, setNewMatkulName] = useState("");
  const [newMatkulSKS, setNewMatkulSKS] = useState(0);
  const [newMatkulMinSemester, setNewMatkulMinSemester] = useState(0);
  const [newMatkulPrediksiIndeks, setNewMatkulPrediksiIndeks] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(null);
  const [jurusanOptions, setJurusanOptions] = useState<Jurusan[]>([]);

  useEffect(() => {
    setNewMatkulName("");
    setSelectedJurusan(null);
    const fetchData = async () => {
      const jurusanResponse = await fetchAllData("jurusan");
      if (!jurusanResponse.success) {
        alert(`Failed to fetch jurusan options: ${jurusanResponse.errorMsg}`);
        return;
      }
      setJurusanOptions(jurusanResponse.data);
    };
    fetchData();
  }, [props.visible]);

  const selectedJurusanTemplate = (option: Jurusan, props: DropdownProps) => {
    if (option) {
      return (
        <div>
          <div>{option.namaJurusan}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const jurusanOptionTemplate = (option: Jurusan) => {
    return (
      <div className="flex align-items-center">
        <div>{option.namaJurusan}</div>
      </div>
    );
  };

  return (
    <Dialog
      header="Tambahkan matkul baru"
      visible={props.visible}
      style={{ width: "50vw" }}
      onHide={props.onHide}
      blockScroll
    >
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        <Dropdown
          inputId="selectedJurusan"
          value={selectedJurusan}
          onChange={(e) => setSelectedJurusan(e.value)}
          options={jurusanOptions}
          optionLabel="namaJurusan"
          placeholder="Nama Jurusan"
          filter
          valueTemplate={selectedJurusanTemplate}
          itemTemplate={jurusanOptionTemplate}
          // className="w-full md:w-14rem"
        />
        <label htmlFor="selectedJurusan">Nama Jurusan</label>
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        a
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        a
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        a
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        a
      </span>
      <Button
        label="Save"
        icon="pi pi-check"
        disabled={
          newMatkulName === "" ||
          selectedJurusan === null ||
          newMatkulSKS === 0 ||
          newMatkulMinSemester === 0 ||
          newMatkulPrediksiIndeks === ""
        }
        onClick={(e) => {
          const postData = async () => {
            const result = await addMatkul([
              {
                namaMatkul: newMatkulName,
                namaJurusan: selectedJurusan!.namaJurusan,
                sks: newMatkulSKS,
                minSemester: newMatkulMinSemester,
                prediksiIndeks: newMatkulPrediksiIndeks,
              },
            ]);
            if (result.success) {
              props.onSubmitSuccess();
            } else {
              console.error("Failed to fetch jurusan:", result.errorMsg);
            }
          };
          postData();
          props.onHide();
        }}
      />
    </Dialog>
  );
}

async function addMatkul(matkul: Matkul[]) {
  try {
    const response = await fetch("http://localhost:3000/matkul", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matkul),
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
