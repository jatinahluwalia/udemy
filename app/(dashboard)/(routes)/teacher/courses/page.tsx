import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import DataTable from './_components/data-table';
import { columns } from './_components/columns';
import Course from '@/lib/models/course.model';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { connectToDB } from '@/lib/db';

const Page = async () => {
  const { userId } = auth();
  if (!userId) return redirect('/');
  connectToDB();
  const courses = await Course.find({ userId });
  return (
    <div className="p-6">
      <Link href={'/teacher/create'}>
        <Button>New Course</Button>
      </Link>
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default Page;
