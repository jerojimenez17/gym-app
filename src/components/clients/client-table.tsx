"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import Modal from "../ui/Modal";
import DeleteButton from "../ui/DeleteButton";
import { ClientFirebaseAdapter } from "@/app/models/ClientFirebaseAdapter";
import Client from "@/app/models/Client";
import ClientForm from "./client-form";
import { fbDB } from "@/app/firebase/config";

interface props {
  descriptionFilter: string;
}

const ClientTable = ({ descriptionFilter }: props) => {
  const [clients, setClients] = useState<Client[]>();
  const [clientToEdit, setClientToEdit] = useState<Client>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    onSnapshot(collection(fbDB, "clients"), (querySnapshot) => {
      const newClients = ClientFirebaseAdapter.fromDocumentDataArray(
        querySnapshot.docs
      );
      setClients(newClients);
    });
  }, []);
  return (
    <>
      <Table className=" bar rounded-xl  bg-red-300 backdrop-filter shadow-xl my-5 backdrop-blur-3xl w-full text-sm md:text-md md:w-3/4 overflow-hidden md:mx-auto">
        <TableHeader className="bg-gray-900 bg-opacity-80">
          <TableRow className=" hover:bg-gray hover:backdrop-filter hover:backdrop-blur ">
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2 w-2 sm:w-12">
              DNI
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2 w-4">
              Nombre
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2 hidden sm:table-cell">
              Apellido
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2 hidden md:table-cell">
              Telefono
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2 hidden sm:table-cell ">
              Mail
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2">
              Fecha de registro
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2">
              Fecha de ultimo pago
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2">
              Estado
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-2">
              Proximo venc
            </TableHead>
            <TableHead className="hover:text-gray-800 text-center font-extrabold text-white text-sm md:text-md  p-1">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients
            ?.filter((client) => {
              return (
                client.name.toLowerCase().includes(descriptionFilter) ||
                client.dni.toLowerCase().includes(descriptionFilter) //TO DO: Implement switch only cod
              );
            })
            ?.map((client) => {
              return (
                <TableRow
                  onClick={() => {
                    setClientToEdit(client);
                    setOpenEditModal(true);
                  }}
                  className="text-center hover:text-black hover:bg-gray hover:backdrop-filter hover:backdrop-blur-lg items-center"
                  key={client.id}
                >
                  <TableCell>{client.dni}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.lastName}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    {client.register_date.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {client.last_paid_date.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{client.paidStatus}</TableCell>
                  <TableCell>
                    {client.expiration_date.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="z-50">
                    <DeleteButton
                      id="deleteButton"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic se propague a la fila
                        setClientToEdit(client);
                        setOpenDeleteModal(true);
                        console.log(openDeleteModal);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {clientToEdit && (
        <Modal
          className=""
          blockButton={false}
          onCancel={() => {
            setOpenDeleteModal(false);
          }}
          visible={openDeleteModal}
          key={clientToEdit.id}
          onClose={() => {
            setOpenDeleteModal(false);
          }}
          onAcept={async () => {
            console.log(clientToEdit);

            await deleteDoc(doc(fbDB, "stock", clientToEdit.id));
            setOpenDeleteModal(false);
          }}
          message="Seguro que desea eliminar este cliente?"
        />
      )}
      {clientToEdit && (
        <Modal
          onClose={() => setOpenEditModal(false)}
          visible={openEditModal}
          blockButton={false}
        >
          <ClientForm
            onClose={() => setOpenEditModal(false)}
            client={clientToEdit}
          />
        </Modal>
      )}
    </>
  );
};

export default ClientTable;
