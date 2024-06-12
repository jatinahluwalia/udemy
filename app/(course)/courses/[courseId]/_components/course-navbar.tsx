import NavbarRoutes from '@/components/shared/navbar-routes';
import { IChapter } from '@/lib/models/chapter.model';
import { ICourse } from '@/lib/models/course.model';
import { IUserProgress } from '@/lib/models/user-progress.model';
import React from 'react';
import CourseMobileSidebar from './course-mobile-sidebar';

interface CourseNavbarProps {
  course: Omit<ICourse, 'chapters'> & {
    chapters: (Omit<IChapter, 'userProgress'> & {
      userProgress: IUserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
