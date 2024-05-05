'use client';

import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/shared/file-upload';
import { addAttachment, deleteAttachment } from '@/actions/attachments.action';
import { IAttachment } from '@/lib/models/attachment.model';
import { ICourse } from '@/lib/models/course.model';

interface AttachmentFormProps {
  initialData: Omit<ICourse, 'attachments'> & { attachments: IAttachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;
const AttachmentForm = ({ courseId, initialData }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (values: FormSchema) => {
    try {
      await addAttachment({ courseId, ...values });
      toast.success('Attachment uploaded');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAttachment({ attachmentId: id, courseId: String(courseId) });
      toast.success('Attachment deleted');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course atttachments
        <Button variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div className="">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) onSubmit({ url });
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Add anything your students might need to complete the course
          </div>
        </div>
      ) : (
        <>
          {initialData.attachments.length === 0 ? (
            <p className="mt-2 text-sm italic text-slate-500">
              No attachemnts yet
            </p>
          ) : (
            <div className="space-y-2">
              {initialData.attachments?.map((attachment, i) => (
                <div
                  className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                  key={attachment.id + i}
                >
                  <File className="mr-2 size-4 shrink-0" />
                  <p className="line-clamp-1 text-sm">{attachment.name}</p>
                  {deletingId === attachment.id ? (
                    <div className="">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : (
                    <button
                      className="ml-auto transition hover:opacity-75"
                      type="button"
                      onClick={() => {
                        onDelete(String(attachment._id));
                      }}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default AttachmentForm;
