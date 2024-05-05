import Category from '@/lib/models/catgeory.model';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    await Category.insertMany([
      {
        name: 'Computer Science',
      },
      {
        name: 'Music',
      },
      {
        name: 'Fitness',
      },
      {
        name: 'Photography',
      },
      {
        name: 'Accounting',
      },
      {
        name: 'Engineering',
      },
      {
        name: 'Filming',
      },
    ]);
    console.log('Seeded');
    return new NextResponse('Seeded');
  } catch (error) {
    console.log('[SEEDING]', error);
    throw error;
  }
};
