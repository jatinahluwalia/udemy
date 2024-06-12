import { IChapter } from '@/lib/models/chapter.model';
import { ICourse } from '@/lib/models/course.model';
import Purchase from '@/lib/models/purchase.model';
import { IUserProgress } from '@/lib/models/user-progress.model';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import CourseSidebarItem from './course-sidebar-item';
import CourseProgress from '@/components/shared/course-progress';

interface CourseSidebarProps {
  course: Omit<ICourse, 'chapters'> & {
    chapters: (Omit<IChapter, 'userProgress'> & {
      userProgress: IUserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const { userId } = auth();
  if (!userId) return redirect('/');
  const purchase = await Purchase.findOne({
    userId,
    courseId: `${course._id}`,
  });
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col border-b p-8">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex w-full flex-col">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={`${chapter._id}`}
            id={`${chapter._id}`}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={`${course._id}`}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
