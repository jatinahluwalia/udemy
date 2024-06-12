import { ICategory } from '@/lib/models/category.model';
import { IChapter } from '@/lib/models/chapter.model';
import { ICourse } from '@/lib/models/course.model';
import { IPurchase } from '@/lib/models/purchase.model';

export type CreateCourse = {
  title: string;
};
export type AddCourseProps = {
  courseId: string;
  categoryId: string;
};
export type AddAttachmentProps = {
  courseId: string;
  url: string;
};
export type DeleteAttachmentProps = {
  courseId: string;
  attachmentId: string;
};
export type AddChapterProps = {
  courseId: string;
  title: string;
};
export type ReorderChapters = {
  items: {
    id: string;
    position: number;
  }[];
  courseId: string;
};

export type UpdateCourseProps = {
  courseId: string;
  chapterId: string;
} & Partial<IChapter>;

export type GetChapterByIdProps = {
  chapterId: string;
  courseId: string;
};

export type UpdateProgressProps = GetChapterByIdProps & {
  isCompleted: boolean;
};

export type GetChapterProps = GetChapterByIdProps & {
  userId: string;
};

export type DeleteChapterProps = GetChapterByIdProps;

export type PublishChapterProps = GetChapterByIdProps;

export type UnpublishChapterProps = GetChapterByIdProps;

export type DeleteCourseProps = { courseId: string };

export type PublishCourseProps = DeleteCourseProps;

export type UnpublishCourseProps = PublishCourseProps;

export type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export type CoursesWithCategoryAndProgress = Omit<
  ICourse,
  'chapters' | 'categoryId'
> & {
  progress: number | null;
  categoryId: ICategory | null;
  chapters: IChapter[];
};

export type DashboardCourses = {
  completedCourses: CoursesWithCategoryAndProgress[];
  coursesInProgress: CoursesWithCategoryAndProgress[];
};

export type PurchaseWithCourse = Omit<IPurchase, 'courseId'> & {
  courseId: ICourse;
};
