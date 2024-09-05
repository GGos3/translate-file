import {
  UnstructuredDirectoryLoader,
} from "@langchain/community/document_loaders/fs/unstructured";
import path from "path";

export async function getchunkedDocsFromUnstructed(uniqueId: string) {
  const absolutePath = path.resolve(
    process.cwd(),
    "public",
    "uploads",
    uniqueId
  );

  const loader = new UnstructuredDirectoryLoader(absolutePath, {
    apiUrl: process.env.UNSTRUCTURED_API_URL,
  });

  const result = await loader.load();

  console.log(result);

  return result;
}
