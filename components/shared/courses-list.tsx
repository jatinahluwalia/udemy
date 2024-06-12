import { CoursesWithCategoryAndProgress } from '@/actions/types';
import React from 'react';
import CourseCard from './course-card';

interface CoursesListProps {
  items: CoursesWithCategoryAndProgress[];
}

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <CourseCard
            key={`${item._id}`}
            id={`${item._id}`}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item.categoryId?.name!}
          />
        ))}
      </div>
      {!items.length && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          No courses found
        </div>
      )}
    </div>
  );
};

export default CoursesList;
