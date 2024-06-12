import { getCategories } from '@/actions/categories.action';
import { getCourses } from '@/actions/courses.action';
import SearchInput from '@/components/shared/search-input';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Categories from './_components/categories';
import CoursesList from '@/components/shared/courses-list';

interface SearchPageProps {
  searchParams: { title?: string; categoryId?: string };
}

const Page = async ({
  searchParams: { categoryId, title },
}: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const categories = await getCategories();
  const courses = await getCourses({ userId, categoryId, title });
  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="space-y-4 p-6">
        <Categories items={JSON.parse(JSON.stringify(categories))} />
        <CoursesList items={JSON.parse(JSON.stringify(courses))} />
      </div>
    </>
  );
};
export default Page;
