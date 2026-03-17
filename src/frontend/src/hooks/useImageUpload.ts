import { HttpAgent } from "@icp-sdk/core/agent";
import { useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

export function useImageUpload() {
  const { identity } = useInternetIdentity();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const config = await loadConfig();
      if (config.storage_gateway_url === "nogateway") {
        // No blob storage available — return an object URL for preview only
        return URL.createObjectURL(file);
      }
      const agent = new HttpAgent({
        identity: identity ?? undefined,
        host: config.backend_host,
      });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) =>
        setUploadProgress(pct),
      );
      return await storageClient.getDirectURL(hash);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, uploadProgress };
}
