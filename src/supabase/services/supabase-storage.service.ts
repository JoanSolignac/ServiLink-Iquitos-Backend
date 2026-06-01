import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';

export interface FileStorageUploadParams {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}

@Injectable()
export class SupabaseStorageService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly configService: ConfigService,
  ) {}

  async upload(params: FileStorageUploadParams): Promise<string> {
    const bucketName = this.configService.getOrThrow<string>(
      'SUPABASE_BUCKET_NAME',
    );
    const path = params.folder
      ? `${params.folder}/${params.fileName}`
      : params.fileName;

    const { error } = await this.supabase.storage
      .from(bucketName)
      .upload(path, params.file, {
        contentType: params.contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(bucketName).getPublicUrl(path);

    return publicUrl;
  }

  async delete(fileUrl: string): Promise<void> {
    const bucketName = this.configService.getOrThrow<string>(
      'SUPABASE_BUCKET_NAME',
    );
    const path = this.extractPathFromUrl(fileUrl, bucketName);

    if (!path) {
      return;
    }

    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`);
    }
  }

  private extractPathFromUrl(
    fileUrl: string,
    bucketName: string,
  ): string | null {
    try {
      const url = new URL(fileUrl);
      const prefix = `/storage/v1/object/public/${bucketName}/`;
      if (url.pathname.startsWith(prefix)) {
        return decodeURIComponent(url.pathname.slice(prefix.length));
      }
      return null;
    } catch {
      return null;
    }
  }
}
