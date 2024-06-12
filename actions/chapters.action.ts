'use server';
import Mux from '@mux/mux-node';
import Chapter, { IChapter } from '@/lib/models/chapter.model';
import {
  AddChapterProps,
  DeleteChapterProps,
  GetChapterByIdProps,
  GetChapterProps,
  PublishChapterProps,
  ReorderChapters,
  UnpublishChapterProps,
  UpdateCourseProps,
  UpdateProgressProps,
} from './types';
import Course from '@/lib/models/course.model';
import { connectToDB } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import MuxData, { IMuxData } from '@/lib/models/mux-data.model';
import { revalidatePath } from 'next/cache';
import Purchase from '@/lib/models/purchase.model';
import Attachment, { IAttachment } from '@/lib/models/attachment.model';
import UserProgress from '@/lib/models/user-progress.model';

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const getChapterById = async ({
  chapterId,
  courseId,
}: GetChapterByIdProps) => {
  try {
    connectToDB();
    const chapter = await Chapter.findOne({
      _id: chapterId,
      courseId,
    }).populate<{
      muxData: IMuxData;
    }>({ path: 'muxData', model: MuxData });
    return chapter;
  } catch (error) {
    console.log('[CHAPTERS]', error);
    return null;
  }
};

export const getChapter = async ({
  chapterId,
  courseId,
  userId,
}: GetChapterProps) => {
  try {
    connectToDB();
    const purchase = await Purchase.findOne({ userId, courseId });
    const course = await Course.findOne({
      isPublished: true,
      _id: courseId,
    }).select('price');

    const chapter = await Chapter.findOne({
      _id: chapterId,
      isPublished: true,
    });

    if (!chapter || !course) throw new Error('Chapter or Course not found');
    let muxData = null;
    let attachments: IAttachment[] = [];
    let nextChapter: IChapter | null = null;

    if (purchase) {
      attachments = await Attachment.find({ courseId });
    }

    if (chapter.isFree || purchase) {
      muxData = await MuxData.findOne({ chapterId });
      nextChapter = await Chapter.findOne({
        position: chapter.position + 1,
        courseId,
        isPublished: true,
      });
    }
    const userProgress = await UserProgress.findOne({ userId, chapterId });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log('[CHAPTER]', error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};

export const createChapter = async ({ courseId, title }: AddChapterProps) => {
  try {
    connectToDB();
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
    connectToDB();
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

export const updateChapter = async ({
  courseId,
  chapterId,
  isPublished,
  ...values
}: UpdateCourseProps) => {
  try {
    connectToDB();
    const { userId } = auth();

    if (!userId) throw new Error('Unauthorized');

    const ownCourse = await Course.findOne({ _id: courseId, userId });

    if (!ownCourse) throw new Error('Unauthorized');

    const chapter = await Chapter.updateOne(
      { _id: chapterId, courseId },
      values,
    );

    if (values.videoUrl) {
      const existingMuxData = await MuxData.findOne({ chapterId });
      if (existingMuxData) {
        await Promise.all([
          video.assets.delete(existingMuxData.assetId),
          MuxData.findByIdAndDelete(existingMuxData._id),
        ]);
      }
      const asset = await video.assets.create({
        input: [{ url: values.videoUrl }],
        playback_policy: ['public'],
        test: false,
      });
      const mux = await MuxData.create({
        chapterId,
        assetId: asset.id,
        playbackId: asset.playback_ids?.[0]?.id,
      });
      await Chapter.findByIdAndUpdate({ _id: chapterId }, { muxData: mux._id });
    }
    return chapter;
  } catch (error) {
    console.log('[CHAPTER]', error);
    throw error;
  }
};

export const deleteChapter = async ({
  chapterId,
  courseId,
}: DeleteChapterProps) => {
  try {
    connectToDB();
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    const ownCourse = await Course.findOne({ _id: courseId, userId });
    if (!ownCourse) throw new Error('Unauthorized');
    const chapter = await Chapter.findOne({ _id: chapterId, courseId });
    if (!chapter) throw new Error('Not found');

    if (chapter.videoUrl) {
      const existingMuxData = await MuxData.findOne({ chapterId });
      if (existingMuxData) {
        await Promise.all([
          video.assets.delete(existingMuxData.assetId),
          MuxData.findByIdAndDelete(existingMuxData._id),
        ]);
      }
    }
    const deletedChapter = await Chapter.findOneAndDelete({
      _id: chapterId,
      courseId,
    }).lean();

    const coursePublishedChapters = await Chapter.find({
      courseId,
      isPublished: true,
    });

    if (!coursePublishedChapters.length) {
      await Course.findByIdAndUpdate(courseId, { isPublished: false });
    }
    revalidatePath(`/teacher/courses/${courseId}`);
    return deletedChapter;
  } catch (error) {
    console.log('[CHAPTERS]', error);
    throw error;
  }
};

export const publishChapter = async ({
  chapterId,
  courseId,
}: PublishChapterProps) => {
  try {
    connectToDB();
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');

    const ownCourse = await Course.findById(courseId);

    if (!ownCourse) throw new Error('Unauthorized');

    const chapter = await Chapter.findOne({ _id: chapterId, courseId });

    const muxData = await MuxData.findOne({ chapterId });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      throw new Error('Missing required fields.');
    }

    const publishedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { isPublished: true },
      { new: true },
    ).lean();

    return publishedChapter;
  } catch (error) {
    console.log('[CHAPTER]', error);
    throw error;
  }
};

export const unpublishChapter = async ({
  chapterId,
  courseId,
}: UnpublishChapterProps) => {
  try {
    connectToDB();
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');

    const ownCourse = await Course.findById(courseId);

    if (!ownCourse) throw new Error('Unauthorized');

    const unpublishedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { isPublished: false },
      { new: true },
    ).lean();

    const publishedChapters = await Chapter.find({
      courseId,
      isPublished: true,
    }).lean();
    if (!publishedChapters.length) {
      await Course.updateOne({ _id: courseId }, { isPublished: false });
    }

    return unpublishedChapter;
  } catch (error) {
    console.log('[CHAPTER]', error);
    throw error;
  }
};

export const updateProgress = async ({
  chapterId,
  courseId,
  isCompleted,
}: UpdateProgressProps) => {
  try {
    connectToDB();

    const { userId } = auth();

    if (!userId) throw new Error('Unauthorized');

    const userProgress = await UserProgress.findOneAndUpdate(
      { userId, chapterId },
      { isCompleted },
      { upsert: true, new: true },
    ).lean();

    return userProgress;
  } catch (error) {
    console.log('[CHAPTER]', error);
    throw error;
  }
};
