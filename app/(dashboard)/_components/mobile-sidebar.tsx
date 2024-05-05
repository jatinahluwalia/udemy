import { Menu, Sidebar } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side={'left'} className="bg-white p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
