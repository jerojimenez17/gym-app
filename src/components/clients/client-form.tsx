// "use client";

// import { ProductSchema } from "@/schemas";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useEffect, useState, useTransition } from "react";
// import { set, z } from "zod";
// import { newProduct } from "../actions/newProduct";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { fbDB, storage } from "@/firebase/config";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { FormSuccess } from "../form-success";
// import { v4 } from "uuid";
// import Image from "next/image";
// import { FormError } from "../form-error";
// import Product from "@/models/Product";
// import NewCategoryModal from "./new-category-modal";
// import { getCategories } from "@/firebase/stock/getCategories";
// import { collection, onSnapshot } from "firebase/firestore";
// import { getSubcategories } from "@/firebase/stock/getSubCategories";
// import NewSubcategoryModal from "./new-subcategory-modal";
// import NewBrandModal from "./new-brand-modal";

// interface props {
//   product?: Product;
//   onClose: () => void;
// }

// const ProductForm = ({ product, onClose }: props) => {
//   const [isPending, startTransition] = useTransition();
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [uploadMessages, setUploadMessage] = useState<string[]>([]);
//   const [errorMessages, setErrorMessages] = useState<string[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [subcategories, setSubcategories] = useState<string[]>([]);
//   const [brands, setBrands] = useState<string[]>([]);
//   const [image, setImage] = useState<File | null>(null);

//   const emptyForm = useForm<z.infer<typeof ProductSchema>>({
//     resolver: zodResolver(ProductSchema),
//     defaultValues: {
//       cod: "",
//       description: "",
//       price: 0,
//       id: "",
//       unit: "",
//       amount: 0,
//       brand: "",
//       category: "",
//       image: "",
//       imageName: "",
//       subCategory: "",
//       gain: 0.0,
//       last_update: new Date(),
//       salePrice: 0,
//     },
//   });
//   const editForm = useForm<z.infer<typeof ProductSchema>>({
//     resolver: zodResolver(ProductSchema),
//     defaultValues: {
//       cod: product?.cod,
//       description: product?.description,
//       price: product?.price,
//       id: product?.id,
//       unit: product?.unit,
//       amount: product?.amount,
//       brand: product?.brand,
//       imageName: product?.imageName,
//       category: product?.category,
//       subCategory: product?.subCategory,
//       gain: product?.gain,
//       last_update: product?.last_update,
//       salePrice: product?.salePrice,
//     },
//   });
//   const onSubmit = (values: z.infer<typeof ProductSchema>) => {
//     startTransition(async () => {
//       const imageName = image?.name + v4();
//       const storageRef = ref(storage, `/productImage/${imageName}`);
//       if (image) {
//         await uploadBytes(storageRef, image)
//           .then(async () => {
//             const newMessageArray = uploadMessages.concat(
//               "✅La imagen se cargo exitosamente!"
//             );
//             setUploadMessage(newMessageArray);
//           })
//           .catch((err) => {
//             const newErrorMessageArray = errorMessages.concat(
//               "❎ Tu imagen no se cargo. Revisa tu conexion y reintentalo"
//             );
//             setErrorMessages(newErrorMessageArray);
//           });
//         const imageURL = await getDownloadURL(storageRef);
//         values.image = imageURL;
//         values.imageName = image.name;

//         await newProduct(values)
//           .then((data) => {
//             if (data.error) {
//               const newErrorArray = errorMessages.concat(data.error);
//               setErrorMessages(newErrorArray);
//             }
//             setUploadMessage(uploadMessages.concat("Producto Cargado"));
//             form.reset();
//             onClose && onClose();
//             // setSuccess(data?.success);
//           })
//           .catch((error) => {
//             const newErrorArray = errorMessages.concat(error.message);
//             setErrorMessages(newErrorArray);
//           });
//       } else {
//         await newProduct(values)
//           .then((data) => {
//             if (data.error) {
//               const newErrorArray = errorMessages.concat(data.error);
//               setErrorMessages(newErrorArray);
//             } else {
//               const newMessageArray = uploadMessages.concat(
//                 "✅Producto cargado exitosamente!"
//               );
//               setUploadMessage(newMessageArray);
//             }
//             form.reset();
//             onClose && onClose();
//             // setSuccess(data?.success);
//           })

//           .catch((error) => {
//             const newErrorArray = errorMessages.concat(error.message);
//             setErrorMessages(newErrorArray);
//           });
//       }
//     });
//   };
//   useEffect(() => {
//     const collectionRef = collection(fbDB, "categories");

//     onSnapshot(collectionRef, (querySnapshot) => {
//       let categories: string[] = [];
//       querySnapshot.docs.forEach((snapshot) => {
//         categories.push(snapshot.data().name);
//         setCategories(categories);
//       });
//     });
//     // getCategories().then((categories) => {
//     // });
//     const collectionSubRef = collection(fbDB, "subcategories");

//     onSnapshot(collectionSubRef, (querySnapshot) => {
//       let subcategories: string[] = [];
//       querySnapshot.docs.forEach((snapshot) => {
//         subcategories.push(snapshot.data().name);
//         setSubcategories(subcategories);
//       });
//     });
//     const collectionBrandRef = collection(fbDB, "brands");

//     onSnapshot(collectionBrandRef, (querySnapshot) => {
//       let brands: string[] = [];
//       querySnapshot.docs.forEach((snapshot) => {
//         brands.push(snapshot.data().name);
//         setBrands(brands);
//       });
//     });
//   }, []);

//   const fileRef = emptyForm.register("image");
//   let form: typeof editForm;
//   if (product) {
//     form = editForm;
//   } else {
//     form = emptyForm;
//   }
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
//         <div className="space-y-4">
//           <FormField
//             control={form.control}
//             name="image"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Foto</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...fileRef}
//                     onChange={(e) => {
//                       if (e.currentTarget.files) {
//                         setImage(e.currentTarget.files[0]);
//                       }
//                     }}
//                     placeholder=""
//                     type="file"
//                     autoComplete="image"
//                     disabled={isPending}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="space-y-4">
//           <FormField
//             control={form.control}
//             name="cod"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Codigo</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder=""
//                     type="text"
//                     autoComplete="cod"
//                     disabled={isPending}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="space-y-4">
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Descripcion</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder=""
//                     type="text"
//                     autoComplete="description"
//                     disabled={isPending}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="space-y-4">
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Precio</FormLabel>
//                 <FormControl>
//                   <Input {...field} disabled={isPending} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//               // <FormItem>
//               //   <FormLabel>Precio</FormLabel>
//               //   <FormControl>
//               //     <input
//               //       type="number"
//               //       placeholder="Precio"
//               //       autoComplete="price"
//               //       {...field}
//               //       disabled={isPending}
//               //     />
//               //   </FormControl>
//               //   <FormMessage />
//               // </FormItem>
//             )}
//           />
//         </div>{" "}
//         <div className="space-y-4 flex w-full">
//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Categoria</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="">
//                       <SelectValue placeholder="Selecciona Categoria" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent className="text-black bg-white">
//                     {categories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex flex-col justify-end">
//             <NewCategoryModal />
//           </div>
//         </div>
//         <div className="space-y-4 flex w-full">
//           <FormField
//             control={form.control}
//             name="subCategory"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Sub-Categoria</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="">
//                       <SelectValue placeholder="Selecciona Sub-Categoria" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent className="text-black bg-white">
//                     {subcategories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex flex-col justify-end">
//             <NewSubcategoryModal />
//           </div>
//         </div>
//         <div className="space-y-4 flex w-full">
//           <FormField
//             control={form.control}
//             name="brand"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Marca</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="">
//                       <SelectValue placeholder="Selecciona Marca" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent className="text-black bg-white">
//                     {brands.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex flex-col justify-end">
//             <NewBrandModal />
//           </div>
//         </div>
//         <div className="space-y-4">
//           <FormField
//             control={form.control}
//             name="gain"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Margen de utilidad</FormLabel>
//                 <FormControl>
//                   <Input {...field} disabled={isPending} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="space-y-4">
//           <FormField
//             control={form.control}
//             name="unit"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Unidad</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Selecciona la unidad de medida" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Unidad">Unidad</SelectItem>
//                     <SelectItem value="Kg">Kg</SelectItem>
//                     <SelectItem value="Gr">Gr</SelectItem>
//                     <SelectItem value="Lt">Lt</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="">
//           <FormField
//             control={form.control}
//             name="amount"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Cantidad</FormLabel>
//                 <FormControl>
//                   <Input type="number" {...field} disabled={isPending} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button type="submit" disabled={isPending} className="w-full">
//           +Agregar Producto
//         </Button>
//       </form>
//       {uploadMessages.map((message) => (
//         <FormSuccess key={message} message={message} />
//       ))}
//       {errorMessages.map((message) => (
//         <FormError key={message} message={message} />
//       ))}
//     </Form>
//   );
// };

// export default ProductForm;
"use client";

import { ProductSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { newProduct } from "../actions/newProduct"; // Importa la función de edición
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { fbDB, storage } from "@/firebase/config";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { FormSuccess } from "../form-success";
import { v4 } from "uuid";
import { FormError } from "../form-error";
import Product from "@/models/Product";
import NewCategoryModal from "./new-category-modal";
import { collection, onSnapshot } from "firebase/firestore";
import NewSubcategoryModal from "./new-subcategory-modal";
import NewBrandModal from "./new-brand-modal";
import { editProduct } from "@/firebase/stock/editProduct";

interface props {
  product?: Product;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: props) => {
  const [isPending, startTransition] = useTransition();
  const [uploadMessages, setUploadMessage] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);

  // Inicializa el formulario con los valores predeterminados basados en el producto existente o en blanco
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      cod: product?.cod || "",
      description: product?.description || "",
      price: product?.price || 0,
      id: product?.id || "",
      unit: product?.unit || "",
      amount: product?.amount || 0,
      brand: product?.brand || "",
      category: product?.category || "",
      image: product?.image || "",
      imageName: product?.imageName || "",
      subCategory: product?.subCategory || "",
      gain: product?.gain || 0.0,
      last_update: product?.last_update || new Date(),
      salePrice: product?.salePrice || 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    startTransition(async () => {
      try {
        let imageURL = product?.image || "";
        let imageName = product?.imageName || "";

        // Si hay una nueva imagen, se carga y se actualiza la URL
        if (image) {
          imageName = `${image.name}_${v4()}`;
          const storageRef = ref(storage, `/productImage/${imageName}`);
          await uploadBytes(storageRef, image);
          imageURL = await getDownloadURL(storageRef);

          // Eliminar la imagen anterior si se cambió la imagen
          if (
            product?.image &&
            product.imageName &&
            imageURL !== product.image
          ) {
            const oldImageRef = ref(
              storage,
              `/productImage/${product.imageName}`
            );
            await deleteObject(oldImageRef).catch(() => {
              console.warn(
                "La imagen anterior no se pudo encontrar o eliminar."
              );
            });
          }

          values.image = imageURL;
          values.imageName = imageName;
        }

        if (product) {
          // Modo de edición: Actualiza el producto existente
          await editProduct(product.id, {
            ...values,
            image: imageURL,
            last_update: new Date(),
            imageName,
          });
          setUploadMessage(["Producto editado con éxito"]);
        } else {
          // Modo de creación: Crea un nuevo producto
          console.log("Entro" + values);
          await newProduct(values);
          setUploadMessage(["Producto cargado con éxito"]);
        }

        form.reset();
        onClose(); // Cerrar el modal o hacer cualquier acción posterior
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessages([error.message]);
        } else {
          setErrorMessages(["Ha ocurrido un error desconocido"]);
        }
      }
    });
  };

  useEffect(() => {
    const collectionRef = collection(fbDB, "categories");

    onSnapshot(collectionRef, (querySnapshot) => {
      const categories: string[] = [];
      querySnapshot.docs.forEach((snapshot) => {
        categories.push(snapshot.data().name);
      });
      setCategories(categories);
    });

    const collectionSubRef = collection(fbDB, "subcategories");

    onSnapshot(collectionSubRef, (querySnapshot) => {
      const subcategories: string[] = [];
      querySnapshot.docs.forEach((snapshot) => {
        subcategories.push(snapshot.data().name);
      });
      setSubcategories(subcategories);
    });

    const collectionBrandRef = collection(fbDB, "brands");

    onSnapshot(collectionBrandRef, (querySnapshot) => {
      const brands: string[] = [];
      querySnapshot.docs.forEach((snapshot) => {
        brands.push(snapshot.data().name);
      });
      setBrands(brands);
    });
  }, []);

  const fileRef = form.register("image");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 bg-opacity-10"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto</FormLabel>
                <FormControl>
                  <Input
                    {...fileRef}
                    onChange={(e) => {
                      if (e.currentTarget.files) {
                        setImage(e.currentTarget.files[0]);
                      }
                    }}
                    placeholder=""
                    type="file"
                    autoComplete="image"
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
            name="cod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder=""
                    type="text"
                    autoComplete="cod"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder=""
                    type="text"
                    autoComplete="description"
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4 flex w-full">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Selecciona Categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="text-black bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-end">
            <NewCategoryModal />
          </div>
        </div>
        <div className="space-y-4 flex w-full">
          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Sub-Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Selecciona Sub-Categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="text-black bg-white">
                    {subcategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-end">
            <NewSubcategoryModal />
          </div>
        </div>
        <div className="space-y-4 flex w-full">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Marca</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Selecciona Marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="text-black bg-white">
                    {brands.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-end">
            <NewBrandModal />
          </div>
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="gain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Margen de utilidad</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4 text-black">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la unidad de medida" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Unidad">Unidad</SelectItem>
                    <SelectItem value="Kg">Kg</SelectItem>
                    <SelectItem value="Gr">Gr</SelectItem>
                    <SelectItem value="Lt">Lt</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {product ? "Guardar Cambios" : "+Agregar Producto"}
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

export default ProductForm;
