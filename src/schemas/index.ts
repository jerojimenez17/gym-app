import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email es obligatorio" }),
  password: z.string().min(1, {
    message: "Contraseña es obligatorio",
  }),
});
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email es obligatorio" }),
  password: z.string().min(6, {
    message: "6 caracteres minimo",
  }),
  name: z.string().min(1, {
    message: "Nombre es obligatorio",
  }),
});
export const UnitsSchema = z.object({
  amount: z.number().min(1, { message: "La cantidad es obligatoria" }),
});
export const ClientSchema = z.object({
  id: z.string(),
  dni: z.string().min(1, { message: "DNI es obligatorio" }),
  phone: z.coerce.string().min(1, { message: "Email es obligatorio" }),
  email: z.union([z.string().email(), z.string().length(0)]).optional(),
  name: z.string().min(1, {
    message: "Nombre es obligatorio",
  }),
  lastName: z.string(),
  register_date: z.date(),
  expiration_date: z.date(),
  last_paid_date: z.date(),
  paidStatus: z.boolean(),
});
