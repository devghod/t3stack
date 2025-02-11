"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Tlogin } from "@/types/auth";
import { loginValidate } from "@/lib/validation";

export const login = async (data: Tlogin) => {
  let userData = null;

  await loginValidate(data).then( async(result) => {
    if (result.success) {
      userData = result.data;
    } else {
      console.log('Validation errors:', result.errors);
    }
  });

  if (userData) {
    try {
      const { email, password } = userData;

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (signInResult?.error) {
        return { error: "Invalid Credentials!" };
      }

      return { 
        success: "Successfully logged in!",
        redirectTo: DEFAULT_LOGIN_REDIRECT
      };

    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid Credentials!" }
          default:
            return { error: "Something went wrong!" }
        }
      }
      throw error;
    }
  }
};