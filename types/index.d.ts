/* eslint-disable no-unused-vars */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
      DATABASE_URL: string;
      UPLOADTHING_SECRET: string;
      UPLOADTHING_APP_ID: string;
      MUX_TOKEN_ID: string;
      MUX_TOKEN_SECRET: string;
      STRIPE_API_KEY: string;
      NEXT_PUBLIC_APP_URL: string;
      STRIPE_WEBHOOK_SCRET: string;
      NEXT_PUBLIC_TEACHER_ID: string;
    }
  }
}
export {};
