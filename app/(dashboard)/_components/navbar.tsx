import React from 'react';
import MobileSidebar from './mobile-sidebar';
import NavbarRoutes from '@/components/shared/navbar-routes';

const Navbar = () => {
  return (
    <div className="flex h-full border-b bg-white p-4 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
