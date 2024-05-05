'use client';

import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isPlayerPage = pathname?.includes('/chapter');
  return (
    <div className="ml-auto flex gap-2">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button>
            <LogOut className="mr-2 size-4" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={'/teacher/courses'}>
          <Button size={'sm'} variant={'ghost'}>
            Teacher mode
          </Button>{' '}
        </Link>
      )}
      <UserButton afterSignOutUrl="" />
    </div>
  );
};

export default NavbarRoutes;
