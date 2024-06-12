import Chapter, { IChapter } from '@/lib/models/chapter.model';
import Course from '@/lib/models/course.model';
import { redirect } from 'next/navigation';

const CourseIdPage = async ({
  params: { courseId },
}: {
  params: { courseId: string };
}) => {
  const course = await Course.findOne({ _id: courseId }).populate<{
    chapters: IChapter[];
  }>({
    path: 'chapters',
    model: Chapter,
    match: { isPublished: true },
    options: { sort: { position: 1 } },
  });
  if (!course) return redirect('/');
  return redirect(`/courses/${courseId}/chapters/${course.chapters[0]._id}`);
};

export default CourseIdPage;
