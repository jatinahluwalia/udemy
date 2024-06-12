'use server';

import { connectToDB } from '@/lib/db';
import Category from '@/lib/models/category.model';
import { AddCourseProps } from './types';

export const getCategories = async () => {
  try {
    connectToDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return categories;
  } catch (error) {
    console.log('[CATEGORIES]', error);
    return [];
  }
};

export const addCourse = async ({ categoryId, courseId }: AddCourseProps) => {
  try {
    connectToDB();
    await Category.findByIdAndUpdate(categoryId, {
      $push: { courses: courseId },
    });
    return 'Success';
  } catch (error) {
    console.log('[CATEGORIES]', error);
    throw error;
  }
};
