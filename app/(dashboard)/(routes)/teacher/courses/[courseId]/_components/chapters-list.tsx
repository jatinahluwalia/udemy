'use client';

import React, { useEffect, useState } from 'react';
import { DndContext, closestCorners, type DragEndEvent } from '@dnd-kit/core';
import { IChapter } from '@/lib/models/chapter.model';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableChapter from './draggable-chapter';

interface ChapterListProps {
  items: IChapter[];
  courseId: string;
  onReorder: (props: {
    items: { id: string; position: number }[];
    courseId: string;
  }) => void;
}

export type ConvertedChapter = Omit<IChapter, 'id'> & { id: string };

const converter = (items: IChapter[]): any =>
  items.map((chapter) => ({ ...chapter, id: `${chapter._id}` }));

const ChaptersList = ({ items, courseId, onReorder }: ChapterListProps) => {
  const [chapters, setChapters] = useState<ConvertedChapter[]>(
    converter(items),
  );
  useEffect(() => {
    setChapters(converter(items));
  }, [items]);

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    const getPosition = (id?: string | number | null) =>
      chapters.findIndex((chapter) => `${chapter._id}` === id);

    const originalPos = getPosition(active.id);
    const newPos = getPosition(over?.id);
    const newItems = arrayMove(chapters, originalPos, newPos);
    setChapters(newItems);
    onReorder({
      items: newItems.map((item, i) => ({ id: item.id, position: i + 1 })),
      courseId,
    });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div>
        <SortableContext
          items={chapters}
          strategy={verticalListSortingStrategy}
        >
          {chapters.map((chapter, i) => (
            <DraggableChapter key={`${chapter._id}`} chapter={chapter} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default ChaptersList;
