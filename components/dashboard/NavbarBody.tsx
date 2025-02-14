"use client";

import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import { Stack, Tooltip } from "@mantine/core";
import { 
  IconDashboardFilled, 
  // IconUserFilled, 
  IconSettingsFilled, 
  IconBrandGraphql, 
  IconColumns 
} from "@tabler/icons-react";
import { NavLink } from "@mantine/core";

const navbarItems = [
  {
    label: "Dashboard",
    Icon: IconDashboardFilled,
    path: "/dashboard",
    color: "var(--mantine-color-blue-filled)"
  },
  // {
  //   label: "Accounts",
  //   Icon: IconUserFilled,
  //   path: "/accounts",
  //   color: "var(--mantine-color-green-filled)"
  // },
  {
    label: "Mantine Datatable",
    Icon: IconColumns,
    path: "/mantinedatatable",
    color: "var(--mantine-color-orange-filled)"
  },
  {
    label: "Profile",
    Icon: IconSettingsFilled,
    path: "/profile",
    color: "var(--mantine-color-pink-filled)"
  },
  {
    label: "GraphQL",
    Icon: IconBrandGraphql,
    path: "/graphql",
    color: "var(--mantine-color-pink-filled)"
  }
];

export const NavbarBody = ({ 
  isDesktop, 
  openedNavbar,
  toggleNavbar 
}: {  
  isDesktop: boolean, 
  openedNavbar: boolean, 
  toggleNavbar: () => void
}) => {

  // const role = useCurrentUserRole();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.includes(path);
  }

  const handleNavigation = (path: string) => {
    if (!isDesktop && openedNavbar) toggleNavbar();
    redirect(path);
  }

  return (
    <Stack 
      align="stretch"
      justify="center"  
      gap="xs" 
    >

      {navbarItems.map((item) => (
        <Tooltip 
          label={item.label} 
          key={item.path} 
          zIndex={1000}
        >
          <NavLink
            label={
              <span
                style={{
                  display: "inline-block",
                  opacity: openedNavbar ? 1 : 0,
                  width: openedNavbar ? "auto" : 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.3s ease-in-out, width 0.3s ease-in-out",
                }}
              >
                {item.label}
              </span>
            }
            leftSection={
              <item.Icon
                size={20}
                stroke={1.5}
                color={item.color}
              />
            }
            onClick={() => handleNavigation(item.path)}
            active={isActive(item.path)}
            styles={{
              root: { justifyContent: isDesktop ? "flex-start" : "center" },
              section: { marginLeft: isDesktop ? "0" : "12px" },
            }}          
          />
        </Tooltip>
      ))}

    </Stack>
  );
}

// const NavbarBodyItem = ({ 
//   label,
//   Icon,
//   path,
//   color,
//   isDesktop,
//   openedNavbar,
//   // toggleNavbar,
//   handleNavigation,
//   isActive
// }: {
//   label: string,
//   Icon: typeof IconDashboardFilled,
//   path: string,
//   color: string,
//   isDesktop: boolean,
//   openedNavbar: boolean,
//   // toggleNavbar?: () => void,
//   handleNavigation: (path: string) => void,
//   isActive: (path: string) => boolean
// }) => {
//   console.log(isActive, path);
//   return (
//     <Tooltip label={label}>
//       <NavLink
//         label={
//           <span
//             style={{
//               display: "inline-block",
//               opacity: openedNavbar ? 1 : 0,
//               width: openedNavbar ? "auto" : 0,
//               overflow: "hidden",
//               whiteSpace: "nowrap",
//               transition: "opacity 0.3s ease-in-out, width 0.3s ease-in-out",
//             }}
//           >
//             Profile
//           </span>
//         }
//         leftSection={<Icon size={20} stroke={1.5} color={color} />}
//         onClick={() => handleNavigation(path)}
//         active={isActive(path)}
//         styles={{
//           root: { justifyContent: isDesktop ? "flex-start" : "center" },
//           section: { marginLeft: isDesktop ? "0" : "12px" },
//         }}   
//       />
//     </Tooltip>
//   );
// }

// NavbarBodyItem.displayName = "NavbarBodyItem";