'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';
import { createCourse } from '@/actions/courses.action';
const Page = () => {
  const router = useRouter();
  const schema = z.object({
    title: z.string().min(1, 'Title is required'),
  });
  type Schema = z.infer<typeof schema>;

  const form = useForm<Schema>({
    defaultValues: {
      title: '',
    },
    resolver: zodResolver(schema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: Schema) => {
    try {
      const data = await createCourse(values);
      router.push(`/teacher/courses/${data._id}`);
      toast.success('Course created');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div className="">
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like your text to name your course? Don&apos;t worry,
          you can change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Advanced Web Development"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Link href={'/'}>
                <Button variant={'ghost'} type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting || !isValid}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
