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
    title: "Verify Evidences",
    path: "/police-station/verify-evidences",
    icon: <IconAlertCircle width="24" height="24" />,
  },
];
