export interface FileStorageUploadParams {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}

export abstract class FileStorage {
  abstract upload(params: FileStorageUploadParams): Promise<string>;
  abstract delete(fileUrl: string): Promise<void>;
}
