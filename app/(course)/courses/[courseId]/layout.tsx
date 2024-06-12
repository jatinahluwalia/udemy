import { getProgress } from '@/actions/user-progress.action';
import Chapter, { IChapter } from '@/lib/models/chapter.model';
import Course from '@/lib/models/course.model';
import UserProgress, { IUserProgress } from '@/lib/models/user-progress.model';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';
import CourseSidebar from './_components/course-sidebar';
import CourseNavbar from './_components/course-navbar';

const CourseLayout = async ({
  children,
  params: { courseId },
}: {
  children: ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect('/');
  const course = await Course.findOne({ _id: courseId }).populate<{
    chapters: IChapter[];
    userProgress: IUserProgress[];
  }>({
    path: 'chapters',
    model: Chapter,
    match: { isPublished: true },
    populate: {
      path: 'userProgress',
      model: UserProgress,
      match: { userId },
    },
    options: { sort: { position: 1 } },
  });

  if (!course) return redirect('/');
  const progressCount = await getProgress({ courseId, userId });
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full md:pl-80">
        <CourseNavbar
          course={JSON.parse(JSON.stringify(course))}
          progressCount={progressCount}
        />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
        <CourseSidebar
          course={JSON.parse(JSON.stringify(course))}
          progressCount={progressCount}
        />
      </div>
      <main className="h-full pt-[80px] md:pl-80">{children}</main>
    </div>
  );
};

export default CourseLayout;
