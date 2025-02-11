import { useCurrentUserRole } from "@/hooks/useClientSide";
import { useAuthStore } from "@/stores/authStore";
import { Burger, Center, Flex, Space, Stack, Text, Tooltip } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import defaultProfile from "@/assets/images/default-profile.jpg";
import { NavbarBody } from "./NavbarBody";

export default function Navbar({ 
  openedNavbar, 
  isDesktop, 
  toggleNavbar
}: { 
  openedNavbar: boolean, 
  isDesktop: boolean,
  toggleNavbar: () => void
}) {

  const { profile } = useAuthStore();
  const profileImage = profile.image || defaultProfile;
  const role = useCurrentUserRole();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/accounts");
    router.prefetch("/profile");
  }, [router]);

  return (
    <>
      <Stack gap="xs">
        <Flex 
          align="center" 
          gap="xs"
          justify={openedNavbar ? "flex-start" : "center"}
        >
          <Burger
            opened={openedNavbar}
            onClick={toggleNavbar}
            size="xs"
          /> 
        </Flex>
        <Center 
          style={{ 
            marginLeft: 'auto', 
            marginRight: 'auto',
            transition: 'all 0.5s ease',
          }}
        >
          <Tooltip label={profile.name} zIndex={1000}>
            <Image
              src={profileImage}
              alt="Profile picture"
              width={isDesktop ? 48 : 40}
              height={isDesktop ? 48 : 40}
              style={{ 
                objectFit: 'cover', 
                borderRadius: '50%',
              }}
            />
          </Tooltip>
          < Space w="xs" />
          <Flex 
            direction="column"
            style={{
              opacity: openedNavbar ? 1 : 0,
              transform: `translateY(${openedNavbar ? "0" : "-10px"})`,
              transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
              height: openedNavbar ? "auto" : 0,
              overflow: "hidden", // Ensures smooth collapsing effect
            }}
          >
              <Text
                size="sm"
                fw="bold"
                tt="capitalize"
              >
                Welcome, {profile.name}
              </Text>
              <Text
                size="xs"
                c="gray.5"
                fw={500}
                tt="capitalize"
              >
                {role}
              </Text>
            </Flex>
        </Center>
      </Stack>
      
      <Space h="sm" />

      <NavbarBody 
        isDesktop={isDesktop} 
        openedNavbar={openedNavbar}
        toggleNavbar={toggleNavbar} 
      />
    </>
  )
}

// export const NavbarBody = ({ 
//   isDesktop, 
//   openedNavbar, 
//   toggleNavbar
// }: {  
//   isDesktop: boolean, 
//   openedNavbar: boolean, 
//   toggleNavbar?: () => void
// }) => {

//   const role = useCurrentUserRole();
//   const pathname = usePathname();

//   const isActive = (path: string) => {
//     return pathname.includes(path);
//   }

//   const handleNavigation = (path: string) => {
//     if (toggleNavbar) toggleNavbar();
//     redirect(path);
//   }

//   return (
//     <Stack 
//       align="stretch"
//       justify="center"  
//       gap="xs" 
//     >
//       <Tooltip label="Dashboard">
//         <NavLink
//           label={
//             <span
//               style={{
//                 display: "inline-block",
//                 opacity: openedNavbar ? 1 : 0,
//                 width: openedNavbar ? "auto" : 0,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 transition: "opacity 0.3s ease-in-out, width 0.3s ease-in-out",
//               }}
//             >
//               Dashboard
//             </span>
//           }
//           leftSection={
//             <IconDashboardFilled  
//               size={20}
//               stroke={1.5}
//               color="var(--mantine-color-blue-filled)"
//             />
//           }
//           onClick={() => handleNavigation("/dashboard")}
//           active={isActive("/dashboard")}
//           styles={{
//             root: { justifyContent: isDesktop ? "flex-start" : "center" },
//             section: { marginLeft: isDesktop ? "0" : "12px" },
//           }}          
//         />
//       </Tooltip>

//       <Tooltip label="Account">
//         <NavLink
//           label={
//             <span
//               style={{
//                 display: "inline-block",
//                 opacity: openedNavbar ? 1 : 0,
//                 width: openedNavbar ? "auto" : 0,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 transition: "opacity 0.3s ease-in-out, width 0.3s ease-in-out",
//               }}
//             >
//               Accounts
//             </span>
//           }
//           leftSection={
//             <IconUserFilled  
//               size={20}
//               stroke={1.5}
//               color="var(--mantine-color-green-filled)"
//             />
//           }
//           onClick={() => handleNavigation("/accounts")}
//           disabled={role !== "ADMIN"}
//           active={isActive("/accounts")}
//           styles={{
//             root: { justifyContent: isDesktop ? "flex-start" : "center" },
//             section: { marginLeft: isDesktop ? "0" : "12px" },
//           }}  
//         />
//       </Tooltip>

//       <Tooltip label="Profile">
//         <NavLink
//           label={
//             <span
//               style={{
//                 display: "inline-block",
//                 opacity: openedNavbar ? 1 : 0,
//                 width: openedNavbar ? "auto" : 0,
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 transition: "opacity 0.3s ease-in-out, width 0.3s ease-in-out",
//               }}
//             >
//               Profile
//             </span>
//           }
//           leftSection={
//             <IconSettingsFilled  
//               size={20}
//               stroke={1.5}
//               color="var(--mantine-color-pink-filled)"
//             />
//           }
//           onClick={() => handleNavigation("/profile")}
//           active={isActive("/profile")}
//           styles={{
//             root: { justifyContent: isDesktop ? "flex-start" : "center" },
//             section: { marginLeft: isDesktop ? "0" : "12px" },
//           }}   
//         />
//       </Tooltip>
//     </Stack>
//   );
// }