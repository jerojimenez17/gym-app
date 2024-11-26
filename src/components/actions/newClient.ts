"use server";

import { addClient } from "@/app/firebase/clients/addClient";
import Client from "@/app/models/Client";
import { ClientSchema } from "@/schemas";
import { z } from "zod";

export const newClient = async (values: z.infer<typeof ClientSchema>) => {
  console.log(values + "Values antess");

  const client: Client = {
    dni: values.dni,
    email: values.email || "",
    expiration_date: values.expiration_date,
    last_paid_date: values.last_paid_date,
    lastName: values.lastName,
    id: values.dni,
    name: values.name,
    paidStatus: values.paidStatus,
    phone: values.phone,
    register_date: new Date(),
  };
  console.log(client);
  const validateFields = ClientSchema.safeParse(client);
  if (validateFields.error) {
    return { error: "Campos Invalidos" };
  }

  await addClient(client);
  return { succcess: "☑️ Cliente Creado! " };
};
