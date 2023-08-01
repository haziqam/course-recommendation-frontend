"use client";
import Image from "next/image";
import styles from "./page.module.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Button } from "primereact/button";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
    </main>
  );
}
