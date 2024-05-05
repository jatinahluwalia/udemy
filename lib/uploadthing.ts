import { OurFileRouter } from '@/app/api/uploadthing/core';
import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader,
} from '@uploadthing/react';

const UploadButton = generateUploadButton<OurFileRouter>();
const UploadDropzone = generateUploadDropzone<OurFileRouter>();
const Uploader = generateUploader<OurFileRouter>();

export { UploadButton, UploadDropzone, Uploader };
