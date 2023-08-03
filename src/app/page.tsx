"use client";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Button } from "primereact/button";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Navbar />
      <div
        style={{
          width: "500px",
          position: "absolute",
          top: "30%",
          borderRadius: "5px",
          padding: "32px",
          boxShadow: "0 0 2px rgb(174, 174, 174)",
        }}
      >
        <h1 style={{ color: "rgb(80, 80, 80)" }}>
          Don't waste your time! We will find the perfect course for you.
        </h1>
        <a href="/bestMatkulFinder">
          <Button label="Get started" />
        </a>
      </div>
    </main>
  );
}
