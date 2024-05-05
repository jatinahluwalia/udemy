import { SignIn } from '@clerk/nextjs';

const Page = () => {
  return <SignIn routing="hash" fallbackRedirectUrl={'/'} />;
};

export default Page;
