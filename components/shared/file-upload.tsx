'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { toast } from 'sonner';

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof OurFileRouter;
}

const FileUpload = ({ endpoint, onChange }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message);
      }}
    />
  );
};

export default FileUpload;
