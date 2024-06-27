import { Client } from "@microsoft/microsoft-graph-client";

type FolderMap = {
  [key: string]: string;
};

export const fetchExistingFolders = async (
  client: Client,
  userId: string
): Promise<FolderMap> => {
  console.log("inside fetchExistingFolders");
  const folderMap: FolderMap = {};
  try {
    const response = await client.api(`/users/${userId}/mailFolders`).get();
    console.log(response, "fetch response");
    // const folders: { value: Array<{ displayName: string; id: string }> } =
    //   response;

    // folders.value.forEach((folder) => {
    //   folderMap[folder.displayName] = folder.id;
    // });
  } catch (error) {
    console.error("Error fetching folders:", error);
  }
  return folderMap;
};

export const createFolder = async (
  client: Client,
  userId: string,
  displayName: string
) => {
  try {
    console.log("inside createFolder");
    const newFolder = await client.api(`/users/${userId}/mailFolders`).post({
      displayName: displayName,
    });
    return newFolder.id;
  } catch (error) {
    console.error(`Error creating folder: ${displayName}`, error);
    return null;
  }
};
