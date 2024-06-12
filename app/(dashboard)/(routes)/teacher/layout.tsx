import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  //   const { userId } = auth();
  //   if (!isTeacher(userId)) return redirect('/');
  return <>{children}</>;
};

export default Layout;
