'use server';

import Chapter from '@/lib/models/chapter.model';
import { AddChapterProps, ReorderChapters } from './types';
import { auth } from '@clerk/nextjs/server';
import Course from '@/lib/models/course.model';

export const createChapter = async ({ courseId, title }: AddChapterProps) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    const courseOwner = await Course.findOne({ _id: courseId, userId });
    if (!courseOwner) throw new Error('Unauthorized');
    const lastChapter = await Chapter.findOne({ courseId }).sort({
      position: -1,
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const chapter = await Chapter.create({
      title,
      position: newPosition,
      courseId,
    });
    await Course.findByIdAndUpdate(courseId, {
      $push: { chapters: `${chapter._id}` },
    });
  } catch (error) {
    console.log('[CHAPTER]', error);
    throw error;
  }
};

export const reorderChapters = async ({ items, courseId }: ReorderChapters) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    const courseOwner = await Course.findOne({ userId, _id: courseId });
    if (!courseOwner) throw new Error('Unauthorized');

    await Promise.all(
      items.map((chapter) =>
        Chapter.findByIdAndUpdate(chapter.id, { position: chapter.position }),
      ),
    );
    return 'done';
  } catch (error) {
    console.log('[CHAPTERS]', error);
    throw error;
  }
};
