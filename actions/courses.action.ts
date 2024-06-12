'use server';

import { connectToDB } from '@/lib/db';
import Attachment, { IAttachment } from '@/lib/models/attachment.model';
import Category, { ICategory } from '@/lib/models/category.model';
import Chapter, { IChapter } from '@/lib/models/chapter.model';
import Course, { ICourse } from '@/lib/models/course.model';
import MuxData, { IMuxData } from '@/lib/models/mux-data.model';
import Purchase from '@/lib/models/purchase.model';
import { auth, currentUser } from '@clerk/nextjs/server';
import Mux from '@mux/mux-node';
import { FilterQuery } from 'mongoose';
import {
  CoursesWithCategoryAndProgress,
  CreateCourse,
  DashboardCourses,
  DeleteCourseProps,
  GetCourses,
  PublishCourseProps,
  UnpublishCourseProps,
} from './types';
import { getProgress } from './user-progress.action';
import Stripe from 'stripe';
import StripeCustomer from '@/lib/models/stripe-customer.model';
import { stripe } from '@/lib/stripe';

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export const getCourses = async ({
  userId,
  categoryId,
  title,
}: GetCourses): Promise<CoursesWithCategoryAndProgress[]> => {
  try {
    const regex = new RegExp(title ?? '', 'i');
    const query: FilterQuery<ICourse> = {
      isPublished: true,
      title: { $regex: regex },
    };
    if (categoryId) query.categoryId = categoryId;
    const courses = await Course.find(query)
      .populate<{ chapters: IChapter[]; categoryId: ICategory }>([
        {
          path: 'chapters',
          model: Chapter,
          select: '_id',
          match: { isPublished: true },
        },
        { path: 'categoryId', model: Category },
        { path: 'purchases', model: Purchase },
      ])
      .sort({ createdAt: -1 })
      .lean();
    const coursesWithProgress: CoursesWithCategoryAndProgress[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return { ...course, progress: null };
          }

          const progressPercentage = await getProgress({
            courseId: `${course._id}`,
            userId,
          });

          return { ...course, progress: progressPercentage };
        }),
      );
    return coursesWithProgress;
  } catch (error) {
    console.log('[COURSES]', error);
    throw error;
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    connectToDB();
    const { userId } = auth();
    const course = await Course.findOne({ _id: courseId, userId })
      .populate<{
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
      ])
      .lean();
    if (!course) throw new Error('Not found');
    return course;
  } catch (error) {
    console.log('[COURSES]', error);
    return null;
  }
};

export const createCourse = async ({ title }: CreateCourse) => {
  try {
    connectToDB();
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    const createdCourse = await Course.create({ userId, title });
    const course = await Course.findById(createdCourse._id).lean();
    if (!course) throw new Error('Something went wrong');
    return course;
  } catch (error) {
    console.log('[COURSES]', error);
    throw error;
  }
};

export const updateCourse = async ({
  courseId,
  ...values
}: Partial<ICourse> & { courseId: string }) => {
  try {
    connectToDB();
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorized');
    const course = await Course.findOneAndUpdate(
      { _id: courseId, userId },
      { ...values },
    ).lean();
    return course;
  } catch (error) {
    console.log('[COURSE_ID]', error);
    return null;
  }
};
export const deleteCourse = async ({ courseId }: DeleteCourseProps) => {
  try {
    connectToDB();
    const { userId } = auth();
    if (!userId) throw new Error('Unauthorzied');

    const course = await Course.findOne({
      _id: courseId,
      userId,
    })
      .populate<{
        chapters: Array<Omit<IChapter, 'muxData'> & { muxData: IMuxData }>;
      }>({
        path: 'chapters',
        model: Chapter,
        populate: { path: 'muxData', model: MuxData },
      })
      .lean();
    if (!course) throw new Error('Not found');

    for (const chapter of course.chapters) {
      if (chapter.muxData.assetId) {
        await Promise.all([
          video.assets.delete(chapter.muxData.assetId),
          MuxData.deleteOne({ chapterId: chapter._id }),
        ]);
      }
    }
    await Promise.all([
      Course.deleteOne({ _id: courseId, userId }),
      Chapter.deleteMany({ courseId }),
      Attachment.deleteMany({ courseId }),
    ]);
    return 'Deleted';
  } catch (error) {
    console.log('[COURSE]', error);
    throw error;
  }
};

export const publishCourse = async ({ courseId }: PublishCourseProps) => {
  try {
    connectToDB();

    const { userId } = auth();

    if (!userId) throw new Error('Unauthorized');

    const course = await Course.findOne({
      _id: courseId,
      userId,
    })
      .populate<{
        chapters: Array<Omit<IChapter, 'muxData'> & { muxData: IMuxData }>;
      }>({
        path: 'chapters',
        model: Chapter,
        populate: { path: 'muxData', model: MuxData },
      })
      .lean();

    if (!course) throw new Error('Not found');

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished,
    );

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      throw new Error('Missing required fields.');
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, userId },
      { isPublished: true },
      { new: true },
    ).lean();
    return updatedCourse;
  } catch (error) {
    console.log('[COURSE]', error);
    return null;
  }
};
export const unpublishCourse = async ({ courseId }: UnpublishCourseProps) => {
  try {
    connectToDB();

    const { userId } = auth();

    if (!userId) throw new Error('Unauthorized');

    const course = await Course.findOne({
      _id: courseId,
      userId,
    });

    if (!course) throw new Error('Not found');

    await Course.findOneAndUpdate(
      { _id: courseId, userId },
      { isPublished: false },
      { new: true },
    ).lean();
    return 'Unpublished';
  } catch (error) {
    console.log('[COURSE]', error);
    return null;
  }
};

export const getDashboardCourses = async (
  userId: string,
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await Purchase.find({ userId }).populate<{
      courseId: Omit<Omit<ICourse, 'categoryId'>, 'chapters'> & {
        categoryId: ICategory;
        chapters: IChapter[];
      };
    }>({
      model: Course,
      path: 'courseId',
      populate: [
        { model: Category, path: 'categoryId' },
        { model: Chapter, path: 'chapters', match: { isPublished: true } },
      ],
    });

    const courses = purchasedCourses.map(
      (purchase) => purchase.courseId,
    ) as CoursesWithCategoryAndProgress[];

    for (const course of courses) {
      const progress = await getProgress({ courseId: course.id, userId });
      course.progress = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100,
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100,
    );

    return { completedCourses, coursesInProgress };
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};

export const checkOutCourse = async ({ courseId }: { courseId: string }) => {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      throw new Error('Unauthorized');
    }

    const course = await Course.findOne({ _id: courseId, isPublished: true });

    const purchase = Purchase.findOne({ userid: user.id, courseId });

    if (!purchase) {
      throw new Error('Already Purchased');
    }
    if (!course) {
      throw new Error('Not found');
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'INR',
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];
    let stripeCustomer = await StripeCustomer.findOne({
      userId: user.id,
    }).select('stripeCustomerId');

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
        address: {
          city: 'Delhi',
          country: 'India',
          line1: 'B-3, Street no.2, Jagat Puri, Delhi-110051, India',
          line2: 'B-3, Street no.2, Jagat Puri, Delhi-110051, India',
          postal_code: '110051',
          state: 'Delhi',
        },
        name: user.fullName!,
      });
      stripeCustomer = await StripeCustomer.create({
        userId: user.id,
        stripeCustomerId: customer.id,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?cancelled=1`,

      metadata: { courseId: course.id, userId: user.id },
    });

    if (!session.url) throw new Error('Unknown Error occured');

    return { url: session.url };
  } catch (error) {
    console.log('[COURSE]', error);
    throw error;
  }
};
