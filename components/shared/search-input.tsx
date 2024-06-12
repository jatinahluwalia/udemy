'use client';

import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
const SearchInput = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: { categoryId: currentCategoryId, title: debouncedValue },
      },
      { skipEmptyString: true, skipNull: true },
    );
    router.push(url);
  }, [router, pathname, debouncedValue, currentCategoryId]);
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 size-4 text-slate-300" />
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-[300px]"
        placeholder="Search for a course"
      />
    </div>
  );
};

export default SearchInput;
