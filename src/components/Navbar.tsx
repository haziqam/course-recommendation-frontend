"use client";
import React from "react";
import { Menubar } from "primereact/menubar";

export function Navbar() {
  const start = (
    <ul style={{ display: "flex", gap: "64px" }}>
      <li>
        <a href="/">Main page</a>
      </li>
      <li>
        <a href="/fakultas">Fakultas</a>
      </li>
      <li>
        <a href="/jurusan">Jurusan</a>
      </li>
      <li>
        <a href="/matkul">Matkul</a>
      </li>
      <li>
        <a href="/bestMatkulFinder">Best Matkul Finder</a>
      </li>
    </ul>
  );

  return (
    <div className="card">
      <Menubar start={start} />
    </div>
  );
}
