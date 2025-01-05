import { Account, Client, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6745e7a800239043bed0");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { account, client, databases, storage };
