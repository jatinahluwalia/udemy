import { SignUp } from '@clerk/nextjs';

const Page = () => {
  return <SignUp routing="hash" fallbackRedirectUrl={'/'} />;
};

export default Page;
