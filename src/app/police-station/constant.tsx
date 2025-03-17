import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconFilePlus,
  IconClipboardCheck,
  IconUser,
  IconAlertCircle,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/police-station/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Manage Cases",
    path: "/police-station/manage-cases",
    icon: <IconFilePlus width="24" height="24" />,
  },
  {
    title: "View Case Logs",
    path: "/police-station/case-logs",
    icon: <IconClipboardCheck width="24" height="24" />,
  },
  {
    title: "Security Alerts",
    path: "/police-station/security-alerts",
    icon: <IconAlertCircle width="24" height="24" />,
  },
  {
    title: "Profile",
    path: "/police-station/profile",
    icon: <IconUser width="24" height="24" />,
  },
];
