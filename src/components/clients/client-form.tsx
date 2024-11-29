"use client";

import { ClientSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { z } from "zod";
// Importa la función de edición
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Client from "@/app/models/Client";
import { FormSuccess } from "../ui/form-success";
import { FormError } from "../ui/form-error";
import { editClient } from "@/app/firebase/clients/editClient";
import { newClient } from "../actions/newClient";

interface Props {
  client?: Client;
  onClose: () => void;
}

const ClientForm = ({ client, onClose }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [uploadMessages, setUploadMessage] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // Calcula las fechas automáticamente
  const today = new Date();
  const defaultExpirationDate = new Date(today);
  defaultExpirationDate.setMonth(today.getMonth() + 1);

  // Configura el formulario
  const form = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      id: client?.id || "",
      dni: client?.dni || "",
      phone: client?.phone || "",
      email: client?.email || "",
      name: client?.name || "",
      lastName: client?.lastName || "",
      register_date: today,
      expiration_date: defaultExpirationDate,
      last_paid_date: client?.last_paid_date || new Date(),
      paidStatus: client?.paidStatus || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof ClientSchema>) => {
    startTransition(async () => {
      try {
        if (client) {
          // Modo edición
          await editClient(client.id, {
            ...values,
            email: values.email ? values.email : "",
          });
          setUploadMessage(["Cliente editado con éxito"]);
        } else {
          // Modo creación
          await newClient(values);
          setUploadMessage(["Cliente cargado con éxito"]);
        }

        form.reset();
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessages([error.message]);
        } else {
          setErrorMessages(["Ha ocurrido un error desconocido"]);
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 bg-opacity-10"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ingrese DNI"
                    type="text"
                    autoComplete="dni"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ingrese teléfono"
                    type="text"
                    autoComplete="phone"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ingrese email"
                    type="email"
                    autoComplete="email"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ingrese nombre"
                    type="text"
                    autoComplete="name"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ingrese apellido"
                    type="text"
                    autoComplete="lastName"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {client ? "Guardar Cambios" : "+ Agregar Cliente"}
        </Button>
      </form>
      {uploadMessages.map((message) => (
        <FormSuccess key={message} message={message} />
      ))}
      {errorMessages.map((message) => (
        <FormError key={message} message={message} />
      ))}
    </Form>
  );
};

export default ClientForm;
