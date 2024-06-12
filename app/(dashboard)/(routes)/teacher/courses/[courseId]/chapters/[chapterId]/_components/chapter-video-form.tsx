'use client';

import { updateChapter } from '@/actions/chapters.action';
import MuxPlayer from '@mux/mux-player-react';
import FileUpload from '@/components/shared/file-upload';
import { Button } from '@/components/ui/button';
import { IChapter } from '@/lib/models/chapter.model';
import { IMuxData } from '@/lib/models/mux-data.model';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

interface ChapterVideoFormProps {
  initialData: Omit<IChapter, 'muxData'> & { muxData?: IMuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;
const ChapterVideoForm = ({
  courseId,
  initialData,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (values: FormSchema) => {
    try {
      await updateChapter({ chapterId, courseId, ...values });
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
        Course video
        <Button variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : initialData.videoUrl ? (
            <>
              <Pencil className="mr-2 size-4" /> Edit video
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add a video
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div className="">
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) onSubmit({ videoUrl: url });
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      ) : initialData.videoUrl ? (
        <div className="relative mt-2 aspect-video">
          <MuxPlayer playbackId={initialData.muxData?.playbackId || ''} />
        </div>
      ) : (
        <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
          <Video className="size-10 text-slate-500" />
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="gap-x-2 text-sm text-muted-foreground">
          Videos can take a few minutes to process. Referesh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};
export default ChapterVideoForm;
