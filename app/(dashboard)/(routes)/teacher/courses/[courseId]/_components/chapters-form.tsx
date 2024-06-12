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
import { Loader2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ICourse } from '@/lib/models/course.model';
import { Input } from '@/components/ui/input';
import { createChapter, reorderChapters } from '@/actions/chapters.action';
import ChaptersList from './chapters-list';

interface ChaptersFormProps {
  initialData: ICourse;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

type FormSchema = z.infer<typeof formSchema>;
const ChaptersForm = ({ courseId, initialData }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const toggleCreating = () => {
    setIsCreating(!isCreating);
  };

  const form = useForm<FormSchema>({
    defaultValues: {
      title: '',
    },
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchema) => {
    try {
      console.log('called');
      await createChapter({ courseId, ...values });
      toast.success('Chapter created');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onReorder = async ({
    courseId,
    items,
  }: {
    items: { id: string; position: number }[];
    courseId: string;
  }) => {
    try {
      setIsUpdating(true);
      await reorderChapters({
        items,
        courseId,
      });
      toast.success('Chapters reordered');
    } catch (error) {
      toast.error('Error reordering');
    } finally {
      router.refresh();
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4">
      {isUpdating && (
        <div className="absolute right-0 top-0 flex size-full items-center justify-center rounded-md bg-slate-500/20">
          <Loader2 className="size-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button variant={'ghost'} onClick={toggleCreating}>
          {isCreating ? (
            'Cancel'
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" /> Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div className={cn('mt-2 text-sm', !initialData.chapters.length)}>
            {!initialData.chapters.length && 'No chapters'}
            <ChaptersList
              onEdit={onEdit}
              onReorder={onReorder}
              courseId={courseId}
              items={JSON.parse(JSON.stringify(initialData.chapters)) || []}
            />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Drag and drop to reorder the chapters
          </p>
        </>
      )}
    </div>
  );
};
export default ChaptersForm;
