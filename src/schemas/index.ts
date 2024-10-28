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
export const ProductSchema = z.object({
  id: z.string(),
  cod: z.string().min(1, { message: "Codigo es obligatorio" }),
  description: z.string().min(1, {
    message: "Descripcion es obligatoria",
  }),
  price: z.coerce.number({
    required_error: "Precio es requerido",
    invalid_type_error: "Debe ser un numero",
  }),
  gain: z.coerce.number({
    invalid_type_error: "Debe ser un numero",
  }),
  salePrice: z.coerce.number(),
  brand: z.string(),
  imageName: z.string(),
  image: z.union([
    z.any(),
    z.string(), // Para cuando image es una URL
    typeof window === "undefined" ? z.any() : z.instanceof(FileList).optional(), // Para cuando estás en el navegador y necesitas un FileList
  ]),
  last_update: z.any(),
  category: z.string(),
  subCategory: z.string(),
  // .any()
  // .refine((file) => {
  //   return !file || file.size <= MAX_UPLOAD_SIZE;
  // }, "File size must be less than 3MB")
  // .refine((file) => {
  //   return ACCEPTED_FILE_TYPES.includes(file.type);
  // }, "El archivo debe ser PDF o PNG")
  // .optional(),
  amount: z.coerce.number({
    required_error: "Cantidad es requerido",
    invalid_type_error: "Debe ser un numero",
  }),
  unit: z.string(),
});
export const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {
    message: "Nombre es obligatorio",
  }),
  cellPhone: z.coerce.number(),
  address: z.string(),
  date: z.date(),
  last_update: z.date(),

  balance: z.coerce.number(),
});
