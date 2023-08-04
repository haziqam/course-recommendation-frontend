import { fetchAllData } from "@/util/fetchAllData";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";

export function AddJurusanDialog(props: {
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
      pt={{ header: { style: { paddingBottom: "0" } } }}
      visible={props.visible}
      style={{ width: "35vw" }}
      onHide={props.onHide}
      blockScroll
    >
      <span className="p-float-label" style={{ marginTop: "24px" }}>
        <Dropdown
          inputId="selectedFakultas"
          pt={{ root: { style: { width: "211px" } } }}
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
        pt={{ root: { style: { marginTop: "24px" } } }}
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
            if (!result.success) {
              console.error("Failed to add jurusan:", result.errorMsg);
              return;
            }
            props.onSubmitSuccess();
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
    const response = await fetch("http://localhost:5000/jurusan", {
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
