'use client';

import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateCourse } from '@/actions/courses.action';
import FileUpload from '@/components/shared/file-upload';
import { ICourse } from '@/lib/models/course.model';

interface ImageFormProps {
  initialData: Omit<ICourse, 'attachments'>;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, 'Image is required'),
});

type FormSchema = z.infer<typeof formSchema>;
const ImageForm = ({ courseId, initialData }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (values: FormSchema) => {
    try {
      await updateCourse({ courseId, ...values });
      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : initialData.imageUrl ? (
            <>
              <Pencil className="mr-2 size-4" /> Edit image
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add an image
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div className="">
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) onSubmit({ imageUrl: url });
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </div>
      ) : initialData.imageUrl ? (
        <div className="relative mt-2 aspect-video">
          <Image
            src={initialData.imageUrl}
            alt="upload"
            fill
            sizes="100vw"
            className="rounded-md object-cover"
          />
        </div>
      ) : (
        <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
          <ImageIcon className="size-10 text-slate-500" />
        </div>
      )}
    </div>
  );
};
export default ImageForm;
