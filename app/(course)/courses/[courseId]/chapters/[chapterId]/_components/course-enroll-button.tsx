'use client';

import { checkOutCourse } from '@/actions/courses.action';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { useState } from 'react';
import { toast } from 'sonner';

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const { url } = await checkOutCourse({ courseId });

      window.location.assign(url);
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      className="w-full md:w-auto"
      size={'sm'}
      onClick={onClick}
      disabled={isLoading}
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
