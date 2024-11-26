"use client";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface props {
  handleOpenModal: () => void;
  handleDescriptionFilter: (filter: string) => void;
}
const ClientFilterPanel = ({
  handleOpenModal,
  handleDescriptionFilter,
}: props) => {
  return (
    <div className="h-28 w-full flex items-center justify-center bg-white bg-opacity-25 shadow rounded-lg mx-auto my-2">
      <Input
        className="w-1/2 h-10 font-bold rounded-full appearance-none border border-blue-400"
        type="search"
        placeholder="Buscar..."
        onChange={(e) => {
          if (e.currentTarget.value === "") {
            handleDescriptionFilter("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleDescriptionFilter(e.currentTarget.value.toLowerCase());
          }
        }}
      />
      <Button
        className="rounded-full h-10 p-1 m-2 hover:font-bold target:bg-blue-400"
        onClick={handleOpenModal}
      >
        ➕Nuevo Cliente
      </Button>
    </div>
  );
};

export default ClientFilterPanel;
