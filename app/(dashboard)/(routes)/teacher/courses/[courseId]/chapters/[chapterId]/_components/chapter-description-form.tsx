'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { updateChapter } from '@/actions/chapters.action';
import Editor from '@/components/shared/editor';
import { IChapter } from '@/lib/models/chapter.model';
import Preview from '@/components/shared/preview';

interface ChapterDescriptionFormProps {
  initialData: IChapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;
const ChapterDescriptionForm = ({
  courseId,
  initialData,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const form = useForm<FormSchema>({
    defaultValues: {
      description: initialData.description ?? '',
    },
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchema) => {
    try {
      await updateChapter({ courseId, chapterId, ...values });
      toast.success('Chapter updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter description
        <Button variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <Pencil className="mr-2 size-4" /> Edit description
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div
          className={cn(
            'mt-2 text-sm',
            !initialData.description && 'italic text-slate-500',
          )}
        >
          {initialData.description ? (
            <Preview value={initialData.description} />
          ) : (
            'No description'
          )}
        </div>
      )}
    </div>
  );
};
export default ChapterDescriptionForm;
