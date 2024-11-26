/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-const */
import { DocumentData } from "firebase/firestore";
import Client from "./Client";

export class ClientFirebaseAdapter {
  public static fromDocumentDataArray(data: DocumentData[]) {
    let state: Client[] = [];
    for (let i = 0; i < data.length; i++) {
      let formatedData = ClientFirebaseAdapter.fromDocumentData(
        data[i].data(),
        data[i].id
      );
      state.push(formatedData);
    }
    console.log(state);
    return state;
  }

  public static fromDocumentData(data: DocumentData, dataId: string) {
    let client = new Client();
    client.id = dataId;
    data.name ? (client.name = data.name) : (client.name = "");
    data.lastName ? (client.lastName = data.lastName) : (client.lastName = "");
    data.phone ? (client.phone = data.phone) : (client.phone = "");
    data.register_date
      ? (client.register_date = data.register_date.toDate())
      : (client.register_date = new Date());

    data.expiration_date
      ? (client.expiration_date = data.expiration_date.toDate())
      : (client.expiration_date = new Date());
    data.last_paid_date
      ? (client.last_paid_date = data.last_paid_date.toDate())
      : (client.last_paid_date = new Date());
    data.paidStatus
      ? (client.paidStatus = data.paidStatus)
      : (client.paidStatus = false);

    return client;
  }
}
