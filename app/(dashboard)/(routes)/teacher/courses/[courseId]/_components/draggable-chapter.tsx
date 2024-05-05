'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import React from 'react';
import { ConvertedChapter } from './chapters-list';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableChapterProps {
  chapter: ConvertedChapter;
}

const DraggableChapter = ({ chapter }: DraggableChapterProps) => {
  const { attributes, setNodeRef, listeners, transform, transition } =
    useSortable({ id: chapter.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      className={cn(
        'mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700',
        chapter.isPublished && 'border-sky-200 bg-sky-100 text-sky-700',
      )}
      {...attributes}
      ref={setNodeRef}
      style={style}
    >
      <div
        className={cn(
          'rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300',
          chapter.isPublished && 'border-r-sky-200 hover:bg-sky-200',
        )}
        {...listeners}
      >
        <Grip className="size-5" />
      </div>
      {chapter.title}
      <div className="ml-auto flex items-center gap-x-2 pr-2">
        {chapter.isFree && <Badge>Free</Badge>}
        <Badge
          className={cn('bg-slate-500', chapter.isPublished && 'bg-sky-700')}
        >
          {chapter.isPublished ? 'Published' : 'Draft'}
        </Badge>
        <Pencil
          onClick={() => {
            //   onEdit(String(chapter._id));
          }}
          className="size-4 cursor-pointer transition hover:opacity-75"
        />
      </div>
    </div>
  );
};

export default DraggableChapter;
