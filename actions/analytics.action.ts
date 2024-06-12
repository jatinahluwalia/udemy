'use server';

import { connectToDB } from '@/lib/db';
import { PurchaseWithCourse } from './types';
import Purchase from '@/lib/models/purchase.model';
import Course, { ICourse } from '@/lib/models/course.model';

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.courseId.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.courseId.price!;
  });
  return grouped;
};

export const getAnalytics = async ({ userId }: { userId: string }) => {
  try {
    connectToDB();
    const purchases = await Purchase.find({ userId })
      .lean()
      .populate<{
        courseId: ICourse;
      }>({ model: Course, path: 'courseId' })
      .lean();
    const groupedEarnings = groupByCourse(purchases);

    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({ name: courseTitle, total }),
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return { data, totalRevenue, totalSales };
  } catch (error) {
    console.log('[ANALYTICS]', error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
