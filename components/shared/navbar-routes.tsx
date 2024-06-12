'use client';

import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import SearchInput from './search-input';

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.includes('/course');
  const isSearchPage = pathname === '/search';

  // const { userId } = useAuth();

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex gap-2">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button>
              <LogOut className="mr-2 size-4" />
              Exit
            </Button>
          </Link>
        ) : (
          // isTeacher(userId) &&
          <Link href={'/teacher/courses'}>
            <Button size={'sm'} variant={'ghost'}>
              Teacher mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="" />
      </div>
    </>
  );
};

export default NavbarRoutes;
