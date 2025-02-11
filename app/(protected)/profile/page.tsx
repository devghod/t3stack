'use server';

import { currentUser } from "@/hooks/useServerSide";
import ProfileInfo from "@/components/profile/ProfileInfo";

async function Page() {
  const user = await currentUser();

  if (!user?.name || !user.email) {
    return null;
  }

  return (
    <>
      <ProfileInfo 
        user={{
          name: user.name,
          email: user.email,
          role: user.role ?? '',
          timezone: user.timezone ?? '',
          image: user.image ?? ''
        }} 
      />
    </>
  );
}

export default Page;