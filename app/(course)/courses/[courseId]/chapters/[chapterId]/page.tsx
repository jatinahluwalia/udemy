import { getChapter } from '@/actions/chapters.action';
import Banner from '@/components/ui/banner';
import { Separator } from '@/components/ui/separator';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CourseEnrollButton from './_components/course-enroll-button';
import VideoPlayer from './_components/video-player';
import Preview from '@/components/shared/preview';
import { File } from 'lucide-react';
import CourseProgressButton from './_components/course-progress-button';

const ChapterIdPage = async ({
  params: { courseId, chapterId },
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect('/');

  const {
    attachments,
    chapter,
    course,
    muxData,
    nextChapter,
    purchase,
    userProgress,
  } = await getChapter({ userId, chapterId, courseId });

  if (!chapter || !course) return redirect('/');

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label="You already completed this chapter"
          variant={'success'}
        />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this course to watch this chapter."
          variant={'warning'}
        />
      )}
      <div className="mx-auto flex max-w-4xl flex-col pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          <Separator />
          <div className="">
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    key={`${attachment._id}`}
                    target="_blank"
                    className="flex w-full items-center rounded-md border bg-sky-200 p-3 text-sky-700 hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
