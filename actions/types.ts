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
