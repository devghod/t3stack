import { StateCreator, create } from 'zustand';
import bcrypt from "bcryptjs";
import { login } from '@/helper/login';
import { getSession } from "next-auth/react";
import { Tprofile, Tregister, Tlogin } from '@/types/auth';
import { UserRole } from "@prisma/client";

type AuthStore = {
  profile: Tprofile;
  loading: boolean;
  login: (data: Tlogin) => Promise<{ error?: string, success?: string }>;
  register: (data: Tregister) => Promise<{ error?: string, success?: string, message?: string }>;
  setProfile: () => Promise<void>;
}

const createAuthActions: StateCreator<AuthStore> = (set) => ({
  profile: { 
    name: '', 
    email: '', 
    image: '', 
    role: UserRole.USER,
    timezone: 'UTC'
  },
  errorMessage: '',
  successMessage: '',
  loading: false,

  setProfile: async() => {
    const session = await getSession();

    if (session?.user) {
      set({ profile: { ...session.user } as Tprofile });
    }
  },

  login: async (data: Tlogin) => {
    set({ loading: true });

    try {
      const result = await login(data);
      set({ loading: false }); 

      if (result?.error) {
        return { error: result.error || 'Internal Error' };
      }

      const session = await getSession();

      if (session?.user) {
        set({ 
          profile: { ...session.user } as Tprofile,
          loading: false
        });

        if (result?.redirectTo) {
          window.location.href = result.redirectTo;
        }

        return { success: "Successfully login!" };
      }

      return { error: 'Session not found' };
    } catch (error) {
      console.log("Error", error)
      set({ loading: false }); 
      return { error: 'Internal Error' };
    }
  },

  register: async (data: Tregister) => {
    set({ loading: true });

    const { email, password, name } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name: name,
      email: email,
      password: hashedPassword
    }

    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    set({ loading: false });

    return response.json();
  },

});

export const useAuthStore = create<AuthStore>()((set, get, store) => ({
  ...createAuthActions(set, get, store),
}));
