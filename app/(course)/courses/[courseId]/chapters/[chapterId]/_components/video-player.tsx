'use client';

import { updateProgress } from '@/actions/chapters.action';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { cn } from '@/lib/utils';
import MuxPlayer from '@mux/mux-player-react';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  chapterId,
  completeOnEnd,
  courseId,
  isLocked,
  nextChapterId,
  playbackId,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await updateProgress({ courseId, chapterId, isCompleted: true });

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success('Progress updated');
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${chapterId}`);
        }
      }
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="relative aspect-video">
      {isLocked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
          <Lock className="size-8" />
          <p className="text-sm">This chapter is locked.</p>
        </div>
      ) : (
        <>
          {isReady ? (
            <div></div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <Loader2 className="size-8 animate-spin text-secondary" />
            </div>
          )}
          <MuxPlayer
            title={title}
            playbackId={playbackId}
            className={cn(!isReady && 'hidden')}
            autoPlay
            onCanPlay={() => setIsReady(true)}
            onEnded={onEnd}
          />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
