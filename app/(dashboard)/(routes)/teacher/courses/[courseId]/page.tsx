import { getCourseById } from '@/actions/courses.action';
import IconBadge from '@/components/shared/icon-badge';
import { auth } from '@clerk/nextjs/server';
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import { getCategories } from '@/actions/categories.action';
import CategoryForm from './_components/category-form';
import PriceForm from './_components/price-form';
import AttachmentForm from './_components/attachment-form';
import ChaptersForm from './_components/chapters-form';
import Banner from '@/components/ui/banner';
import Actions from './_components/actions';

const Page = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) return redirect('/');
  const { courseId } = params;
  const course = await getCourseById(courseId);
  if (!course) return redirect('/teacher/courses');
  const categories = await getCategories();

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            courseId={courseId}
            disabled={!isComplete}
            isPublished={course.isPublished}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge
                size={'sm'}
                variant={'success'}
                icon={LayoutDashboard}
              />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initialData={JSON.parse(JSON.stringify(course))}
              courseId={`${course._id}`}
            />
            <DescriptionForm
              initialData={JSON.parse(JSON.stringify(course))}
              courseId={`${course._id}`}
            />
            <ImageForm
              initialData={JSON.parse(JSON.stringify(course))}
              courseId={`${course._id}`}
            />
            <CategoryForm
              initialData={JSON.parse(JSON.stringify(course))}
              courseId={`${course._id}`}
              options={categories.map((category) => ({
                label: category.name,
                value: String(category._id),
              }))}
            />
          </div>
          <div className="space-y-6">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm
                initialData={JSON.parse(JSON.stringify(course))}
                courseId={`${course._id}`}
              />
            </div>
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm
                initialData={JSON.parse(JSON.stringify(course))}
                courseId={`${course._id}`}
              />
            </div>
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm
                initialData={JSON.parse(JSON.stringify(course))}
                courseId={`${course._id}`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
