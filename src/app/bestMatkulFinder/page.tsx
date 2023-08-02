"use client";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { fetchAllData } from "@/util/fetchAllData";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MatkulTable } from "../matkul/matkulTable";
import { Navbar } from "@/components/Navbar";

export default function Page() {
  const [fakultasOptions, setFakultasOptions] = useState<Fakultas[]>([]);
  const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(
    null
  );
  const [semester, setSemester] = useState("");
  const [minSKS, setMinSKS] = useState("");
  const [maxSKS, setMaxSKS] = useState("");
  const [availableMatkul, setAvailableMatkul] = useState<Matkul[]>([]);
  const [bestMatkul, setBestMatkul] = useState<Matkul[]>([]);
  const [bestMatkulIP, setBestMatkulIP] = useState(0);
  const [bestMatkulSKS, setBestMatkulSKS] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const fakultasResponse = await fetchAllData("fakultas");
      if (!fakultasResponse.success) {
        alert(`Failed to fetch fakultas options: ${fakultasResponse.errorMsg}`);
        return;
      }
      setFakultasOptions(fakultasResponse.data);
    };
    fetchData();
  }, []);

  const dataNotFilled = () => selectedFakultas === null || semester === "";
  const SKSnotFilled = () => minSKS === "" || maxSKS === "";
  const isSKSvalid = () => minSKS <= maxSKS;

  return (
    <div>
      <Navbar />
      <Panel header="Cari matkul">
        <label htmlFor="namaFakultas" style={{ display: "block" }}>
          Fakultas
        </label>
        <Dropdown
          inputId="namaFakultas"
          value={selectedFakultas}
          options={fakultasOptions}
          optionLabel="namaFakultas"
          onChange={(e) => {
            setSelectedFakultas(e.value);
          }}
        />
        <label htmlFor="semester" style={{ display: "block" }}>
          Semester saat ini
        </label>
        <InputText
          id="semester"
          value={semester}
          keyfilter="pint"
          onChange={(e) => {
            setSemester(e.target.value);
          }}
        />
        <Button
          label="Lihat matkul yang tersedia"
          disabled={dataNotFilled()}
          onClick={async (e) => {
            if (dataNotFilled()) return;
            const result = await findAvailableMatkul(
              selectedFakultas!.namaFakultas,
              parseInt(semester)
            );
            if (!result.success) {
              // Toast gagal
              return;
            }
            setAvailableMatkul(result.availableMatkul!);
          }}
        />
      </Panel>
      <MatkulTable allMatkul={availableMatkul} />
      <Panel header="Informasi SKS">
        <label htmlFor="minSKS" style={{ display: "block" }}>
          SKS minimum yang dapat diambil
        </label>
        <InputText
          id="minSKS"
          value={minSKS}
          keyfilter="pint"
          onChange={(e) => {
            setMinSKS(e.target.value);
          }}
        />
        <label htmlFor="maxSKS" style={{ display: "block" }}>
          SKS maksimum yang dapat diambil
        </label>
        <InputText
          id="maxSKS"
          value={maxSKS}
          keyfilter="pint"
          onChange={(e) => {
            setMaxSKS(e.target.value);
          }}
        />
        <Button
          label="Cari pilihan matkul terbaik"
          disabled={dataNotFilled() || SKSnotFilled()}
          onClick={async (e) => {
            if (!isSKSvalid) {
              //toast invalid
              return;
            }
            const result = await findBestMatkul(
              selectedFakultas!.namaFakultas,
              parseInt(semester),
              parseInt(minSKS),
              parseInt(maxSKS)
            );

            if (!result.success) {
              // toast gagal
              return;
            }
            setBestMatkul(result.bestMatkul!);
            setBestMatkulIP(result.bestMatkulIP!);
            setBestMatkulSKS(result.bestMatkulSKS!);
            // updateRender(bestRenderHelper, setBestRenderHelper);
          }}
        />
      </Panel>
      <MatkulTable allMatkul={bestMatkul} />
      <Panel header="Prediksi">
        <div>{bestMatkulIP}</div>
        <div>{bestMatkulSKS}</div>
      </Panel>
    </div>
  );
}

async function findAvailableMatkul(namaFakultas: string, semester: number) {
  try {
    const encodedNamaFakultas = encodeURIComponent(namaFakultas);
    const response = await fetch(
      `http://localhost:3000/matkul/find?fakultas=${encodedNamaFakultas}&semester=${semester}`
    );

    if (!response.ok) {
      const errorMsg = await response.json();
      return { success: false, errorMsg: errorMsg.error as string };
    }

    const availableMatkul = await response.json();
    return { success: true, availableMatkul: availableMatkul as Matkul[] };
  } catch (error) {
    return { success: false, errorMsg: (error as Error).message };
  }
}

async function findBestMatkul(
  namaFakultas: string,
  semester: number,
  minSKS: number,
  maxSKS: number
) {
  try {
    const encodedNamaFakultas = encodeURIComponent(namaFakultas);
    const response = await fetch(
      `http://localhost:3000/matkul/find/bestOptions?fakultas=${encodedNamaFakultas}&semester=${semester}&minSKS=${minSKS}&maxSKS=${maxSKS}`
    );

    if (!response.ok) {
      const errorMsg = await response.json();
      return { success: false, errorMsg: errorMsg.error as string };
    }

    const result = (await response.json()) as BestMatkulData;
    return {
      success: true,
      bestMatkul: result.bestOptions,
      bestMatkulIP: result.IP,
      bestMatkulSKS: result.SKS,
    };
  } catch (error) {
    return { success: false, errorMsg: (error as Error).message };
  }
}
