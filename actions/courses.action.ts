'use server';

import { auth } from '@clerk/nextjs/server';
import Course, { ICourse } from '@/lib/models/course.model';
import { connectToDB } from '@/lib/db';
import { CreateCourse } from './types';
import Attachment, { IAttachment } from '@/lib/models/attachment.model';
import Chapter, { IChapter } from '@/lib/models/chapter.model';

export const getCourseById = async (courseId: string) => {
  try {
    connectToDB();
    const { userId } = auth();
    const course = await Course.findOne({ _id: courseId, userId }).populate<{
      attachments: IAttachment[];
      chapters: IChapter[];
    }>([
      {
        path: 'attachments',
        model: Attachment,
        options: { sort: { createdAt: -1 } },
      },
      {
        path: 'chapters',
        model: Chapter,
        options: { sort: { position: 1 } },
      },
    ]);
    if (!course) throw new Error('Not found');
    return course;
  } catch (error) {
    console.log('[COURSES]', error);
    throw error;
  }
};

export const createCourse = async ({ title }: CreateCourse) => {
  try {
    connectToDB();
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    const course = await Course.create({ userId, title });
    return course;
  } catch (error) {
    console.log('[COURSES]', error);
    throw error;
  }
};

export const updateCourse = async ({
  _id: courseId,
  ...values
}: Partial<ICourse>) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    const course = await Course.findOneAndUpdate(
      { _id: courseId, userId },
      { ...values },
    );
    return course;
  } catch (error) {
    console.log('[COURSE_ID]', error);
    throw error;
  }
};
