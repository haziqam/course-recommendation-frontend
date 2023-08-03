"use client";
import React, { useEffect, useRef, useState } from "react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Navbar } from "@/components/Navbar";
import { updateRender } from "@/util/updateRender";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { fetchAllData } from "@/util/fetchAllData";
import { MatkulTable } from "./matkulTable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { showError, showSuccess } from "@/util/toastFunctions";

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
      <Toast ref={toastRef} position="bottom-right" />
      <p>Here's matkul</p>
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
      <Toolbar start={toolbarContent} />
      <MatkulTable
        allMatkul={allMatkul}
        isDeletable={true}
        onModify={() => {
          updateRender(tableRenderHelper, setTableRenderHelper);
        }}
      />
    </div>
  );
}

function AddMatkulDialog(props: {
  visible: boolean;
  onHide: () => void;
  onSubmitSuccess: () => void;
  toastRef: React.RefObject<Toast>;
}) {
  const [newMatkulName, setNewMatkulName] = useState("");
  const [newMatkulSKS, setNewMatkulSKS] = useState("");
  const [newMatkulMinSemester, setNewMatkulMinSemester] = useState("");
  const [newMatkulPrediksiIndeks, setNewMatkulPrediksiIndeks] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(null);
  const [jurusanOptions, setJurusanOptions] = useState<Jurusan[]>([]);

  const resetFormData = () => {
    setNewMatkulName("");
    setNewMatkulSKS("");
    setNewMatkulMinSemester("");
    setNewMatkulPrediksiIndeks("");
    setSelectedJurusan(null);
  };

  useEffect(() => {
    resetFormData();
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
      return <div>{option.namaJurusan}</div>;
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

  const dataNotFilled = () => {
    return (
      newMatkulName === "" ||
      selectedJurusan === null ||
      newMatkulSKS === "" ||
      newMatkulMinSemester === "" ||
      newMatkulPrediksiIndeks === ""
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
        />
        <label htmlFor="selectedJurusan">Nama Jurusan</label>
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        <InputText
          id="newMatkulName"
          value={newMatkulName}
          onChange={(e) => {
            setNewMatkulName(e.target.value);
          }}
        />
        <label htmlFor="newMatkulName">Nama Matkul</label>
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        <InputText
          id="newMatkulMinSemester"
          value={newMatkulMinSemester}
          keyfilter="pint"
          onChange={(e) => {
            setNewMatkulMinSemester(e.target.value);
          }}
        />
        <label htmlFor="newMatkulMinSemester">
          Semester Minimum Pengambilan
        </label>
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        <InputText
          id="newMatkulSKS"
          value={newMatkulSKS}
          keyfilter="pint"
          onChange={(e) => {
            setNewMatkulSKS(e.target.value);
          }}
        />
        <label htmlFor="newMatkulSKS">SKS</label>
      </span>
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        <Dropdown
          inputId="newMatkulPrediksiIndeks"
          value={newMatkulPrediksiIndeks}
          onChange={(e) => setNewMatkulPrediksiIndeks(e.value)}
          options={["A", "AB", "B", "BC", "C", "D", "E"]}
          placeholder="Prediksi Indeks"
        />
        <label htmlFor="newMatkulPrediksiIndeks">Prediksi Indeks</label>
      </span>
      <Button
        label="Save"
        icon="pi pi-check"
        disabled={dataNotFilled()}
        onClick={(e) => {
          const postData = async () => {
            const result = await addMatkul([
              {
                namaMatkul: newMatkulName,
                namaJurusan: selectedJurusan!.namaJurusan,
                sks: parseInt(newMatkulSKS),
                minSemester: parseInt(newMatkulMinSemester),
                prediksiIndeks: newMatkulPrediksiIndeks,
              },
            ]);
            if (!result.success) {
              showError(
                props.toastRef,
                `Gagal menambahkan matkul: ${result.errorMsg}. Pastikan data valid, ` +
                  "nama matkul unik terhadap nama jurusan, serta nama jurusan teredia " +
                  "pada tabel jurusan"
              );
              return;
            }
            showSuccess(props.toastRef, "Berhasil menambahkan matkul");
            props.onSubmitSuccess();
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
    const response = await fetch("http://localhost:5000/matkul", {
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
