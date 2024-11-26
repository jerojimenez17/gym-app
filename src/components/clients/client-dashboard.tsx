"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import ClientForm from "./client-form";
import ClientFilterPanel from "./client-filter-panel";
import ClientTable from "./client-table";

const ClientDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [descriptionFilter, setDescriptionFilter] = useState("");
  return (
    <div className="flex flex-col h-full w-full items-center overflow-auto">
      <Modal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        blockButton={false}
        message={""}
      >
        <ClientForm onClose={() => setOpenModal(false)} />
      </Modal>
      <ClientFilterPanel
        handleDescriptionFilter={(filter: string) =>
          setDescriptionFilter(filter)
        }
        handleOpenModal={() => setOpenModal(!openModal)}
      />
      <ClientTable descriptionFilter={descriptionFilter} />
    </div>
  );
};

export default ClientDashboard;
