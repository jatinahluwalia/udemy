import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { IChapter } from '@/lib/models/chapter.model';
import { ICourse } from '@/lib/models/course.model';
import { IUserProgress } from '@/lib/models/user-progress.model';
import { Menu } from 'lucide-react';
import React from 'react';
import CourseSidebar from './course-sidebar';

interface CourseMobileSidebarProps {
  course: Omit<ICourse, 'chapters'> & {
    chapters: (Omit<IChapter, 'userProgress'> & {
      userProgress: IUserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
