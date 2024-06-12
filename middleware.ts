import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware((auth, req) => {
  if (
    !['/api/uploadthing', '/sign-in', '/sign-up', '/api/webhook'].includes(
      req.nextUrl.pathname,
    )
  ) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
