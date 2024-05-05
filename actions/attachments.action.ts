'use server';

import { connectToDB } from '@/lib/db';
import { AddAttachmentProps, DeleteAttachmentProps } from './types';
import Attachment from '@/lib/models/attachment.model';
import { auth } from '@clerk/nextjs/server';
import Course from '@/lib/models/course.model';

export const addAttachment = async ({ courseId, url }: AddAttachmentProps) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    connectToDB();
    const courseOwner = await Course.findOne({ _id: courseId, userId });
    if (!courseOwner) throw new Error('Unauthorized');
    const attachment = await Attachment.create({
      courseId,
      url,
      name: url.split('/').pop(),
    });
    await Course.findByIdAndUpdate(courseId, {
      $push: { attachments: attachment.id },
    });
    return attachment;
  } catch (error) {
    console.log('[ATTACHMENTS]', error);
    throw error;
  }
};

export const deleteAttachment = async ({
  attachmentId,
  courseId,
}: DeleteAttachmentProps) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    const courseOwner = await Course.findOne({ _id: courseId, userId });
    if (!courseOwner) throw new Error('Unauthorized');
    const attachment = await Attachment.findByIdAndDelete(attachmentId);
    // if (!attachment) throw new Error('Attachment not found');
    console.log({ attachmentId });
    await Course.findByIdAndUpdate(courseId, {
      $pull: { attachments: attachmentId },
    });
    return attachment;
  } catch (error) {
    console.log('[ATTACHMENTS]', error);
    throw error;
  }
};
