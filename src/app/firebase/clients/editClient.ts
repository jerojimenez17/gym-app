import { doc, runTransaction } from "firebase/firestore";
import { fbDB } from "../config";
import Client from "@/app/models/Client";

export const editClient = async (clientId: string, clientData: Client) => {
  const stockRef = doc(fbDB, "clients", clientData.id);
  try {
    await runTransaction(fbDB, async (transaction) => {
      const productDoc = await transaction.get(stockRef);
      if (!productDoc.exists()) {
        throw new Error(`El cliente con ID ${clientId} no existe en el stock.`);
      }

      // Opcional: Si necesitas adaptar los datos antes de la actualización
      // let adaptedProduct = ProductFirebaseAdapter.fromDocumentData(
      //   productDoc.data(),
      //   productDoc.data().id
      // );

      // Actualizar el producto en Firestore
      transaction.update(stockRef, {
        ...productDoc.data(), // Mantenemos los datos existentes
        ...clientData, // Sobrescribimos con los nuevos datos
        last_update: new Date(), // Actualizamos la fecha de la última modificación
      });
    });
  } catch (err) {
    throw new Error(
      `Error al editar el cliente: ${
        err instanceof Error ? err.message : "error desconocido"
      }`
    );
  }
};
