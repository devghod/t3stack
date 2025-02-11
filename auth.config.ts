import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { getUserByEmail } from "@/helper/user"
import { loginValidate } from "@/lib/validation"
import { User } from "@prisma/client"

export default { 
  providers: [
    Credentials({
      async authorize(
        credentials: Partial<Record<string, unknown>>,
      ): Promise<User | null> {
        let userData = null;
        
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await loginValidate({
          email: credentials.email as string,
          password: credentials.password as string
        }).then(async(result) => {
          if (result.success) {
            userData = result.data;
          } else {
            console.log('Validation errors:', result.errors);
          }
        });
        
        if (userData) {
          const { email, password } = userData;
          const user = await getUserByEmail(email);
          console.log("timezone", user)
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (passwordMatch) return { 
            ...user, 
            role: user.role, 
            timezone: user.timezone || 'UTC' 
          };
        }
        
        return null;
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
  ] 
} satisfies NextAuthConfig

