import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/homepage") || req.nextUrl.pathname.startsWith("/analyze")) {
          return !!token;
        }
        return true;
      },
    },
    pages:{
        signIn: "/login"
    }
  }
);

export const config = {
  matcher: ["/homepage/:path*","/analyze/:path*"],
};
