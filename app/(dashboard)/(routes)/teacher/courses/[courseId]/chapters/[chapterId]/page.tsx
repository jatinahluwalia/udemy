import { getChapterById } from '@/actions/chapters.action';
import IconBadge from '@/components/shared/icon-badge';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterVideoForm from './_components/chapter-video-form';
import Banner from '@/components/ui/banner';
import ChapterActions from './_components/chapter-actions';

interface Props {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const Page = async ({ params: { courseId, chapterId } }: Props) => {
  const { userId } = auth();
  if (!userId) return redirect('/');

  const chapter = await getChapterById({ chapterId, courseId });

  if (!chapter) return redirect('/');

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isCompleted = requiredFields.every(Boolean);
  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant={'warning'}
          label="Chapter is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 size-4" /> Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                chapterId={chapterId}
                courseId={courseId}
                disabled={!isCompleted}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                initialData={JSON.parse(JSON.stringify(chapter))}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm
                chapterId={chapterId}
                courseId={courseId}
                initialData={JSON.parse(JSON.stringify(chapter))}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <ChapterAccessForm
              chapterId={chapterId}
              courseId={courseId}
              initialData={JSON.parse(JSON.stringify(chapter))}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm
              initialData={JSON.parse(JSON.stringify(chapter))}
              chapterId={chapterId}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
