'use server';

import Chapter from '@/lib/models/chapter.model';
import UserProgress from '@/lib/models/user-progress.model';
export const getProgress = async ({
  courseId,
  userId,
}: {
  userId: string;
  courseId: string;
}): Promise<number> => {
  try {
    const publishedChapters = await Chapter.find({
      courseId,
      isPublished: true,
    }).select('_id');
    const publishedChapterIds = publishedChapters.map(
      (chapter) => `${chapter._id}`,
    );
    const validCompletedChapters = await UserProgress.countDocuments({
      userId,
      chapterId: { $in: publishedChapterIds },
      isCompleted: true,
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;
    return progressPercentage;
  } catch (error) {
    console.log('[PROGRESS]');
    return 0;
  }
};
