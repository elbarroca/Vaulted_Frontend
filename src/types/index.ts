import { DdcClient } from "@cere-ddc-sdk/ddc-client";

export interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
  authorizedUsers: string[];
  cid: string;
  mimeType: string;
  description: string;
  folderId: string | null;
  previewUrl?: string;
  uploadProgress?: number;
  starred?: boolean;
  shared?: boolean;
  url?: string;
}

export interface StorageConfig {
  client: DdcClient;
  clusterId?: string;
  walletAddress: string;
} 