"use client"

import { useUserStore } from "@/stores/userStore";
import { TUser } from "@/types/user";
import { useEffect, useState } from "react";

export default function AccountDetails({ accountId }: { accountId: string }) {
  const [user, setUser] = useState<TUser | null>(null);
  const { getUserById } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUserById(accountId);
      if (response) {
        setUser(response);
      }
    }
    fetchUser();
  }, [accountId, getUserById]);

  return <div>Account Details: {JSON.stringify(user)}</div>
} 