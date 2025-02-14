import Image from "next/image";
import defaultProfile from "@/assets/images/default-profile.jpg";

export const profileImage = (image: string | null) => {
  const profileImage = image || defaultProfile;
  return (
    <Image
      src={profileImage}
      alt="Profile picture"
      width={40}
      height={40}
      style={{ objectFit: 'cover', borderRadius: '50%' }}
      priority
    />
  );
}