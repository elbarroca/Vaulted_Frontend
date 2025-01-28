import { DdcClient } from "@cere-ddc-sdk/ddc-client";

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  authorizedUsers: string[];
  cid: string;
  mimeType: string;
  description: string;
  folderId: string | null;
}

export interface StorageConfig {
  client: DdcClient;
  clusterId?: string;
  walletAddress: string;
} 