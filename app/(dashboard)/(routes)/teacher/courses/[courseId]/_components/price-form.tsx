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
import { updateCourse } from '@/actions/courses.action';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';
import { ICourse } from '@/lib/models/course.model';

interface PriceFormProps {
  initialData: Omit<ICourse, 'attachments'>;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

type FormSchema = z.infer<typeof formSchema>;
const PriceForm = ({ courseId, initialData }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const form = useForm<FormSchema>({
    defaultValues: {
      price: initialData.price ?? undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchema) => {
    try {
      await updateCourse({ _id: courseId, ...values });
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
        Course price
        <Button variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <Pencil className="mr-2 size-4" /> Edit price
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step={'0.01'}
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Set a price for your course"
                    />
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
        <p
          className={cn(
            'mt-2 text-sm',
            !initialData.price && 'italic text-slate-500',
          )}
        >
          {initialData.price ? formatPrice(initialData.price) : 'No price'}
        </p>
      )}
    </div>
  );
};
export default PriceForm;