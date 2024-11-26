import { fbDB } from "../config";
import { addDoc, collection } from "firebase/firestore";
import Client from "@/app/models/Client";

export const addClient = async (client: Client) => {
  try {
    const collectionRef = collection(fbDB, "clients");
    console.log(collectionRef);
    await addDoc(collectionRef, { ...client, id: client.dni });
  } catch (err) {
    return { error: "Error al guardar producto" + err };
  }
};
