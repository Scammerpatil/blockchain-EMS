import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconFileText,
  IconShieldCheck,
  IconClipboardCheck,
  IconUser,
  IconBuilding,
  IconAlertCircle,
  IconLockSquare,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Manage Police Stations",
    path: "/admin/manage-police-stations",
    icon: <IconBuilding width="24" height="24" />,
  },
  {
    title: "Verify Evidence Integrity",
    path: "/admin/verify-evidence",
    icon: <IconShieldCheck width="24" height="24" />,
  },
  {
    title: "Profile",
    path: "/admin/profile",
    icon: <IconUser width="24" height="24" />,
  },
];
