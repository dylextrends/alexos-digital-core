import {
  LayoutDashboard,
  Users,
  Wallet,
  Landmark,
  Car,
  ShoppingBag,
  Megaphone,
  Target,
  TrendingDown,
  CheckSquare,
  Calendar,
  BarChart3,
  FileText,
  StickyNote,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface ModuleDef {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
  group: "Overview" | "Operations" | "Growth" | "Productivity" | "System";
}

export const modules: ModuleDef[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Executive overview and key performance indicators.",
    group: "Overview",
  },
  {
    title: "People",
    url: "/people",
    icon: Users,
    description: "Contacts, clients, team and relationships.",
    group: "Operations",
  },
  {
    title: "Money Center",
    url: "/money-center",
    icon: Wallet,
    description: "Cash flow, income and expenses across accounts.",
    group: "Operations",
  },
  {
    title: "Banking",
    url: "/banking",
    icon: Landmark,
    description: "Accounts, transfers and reconciliations.",
    group: "Operations",
  },
  {
    title: "Vehicle Sales",
    url: "/vehicle-sales",
    icon: Car,
    description: "Inventory, deals and dealer performance.",
    group: "Operations",
  },
  {
    title: "E-Commerce",
    url: "/e-commerce",
    icon: ShoppingBag,
    description: "Storefronts, orders and product catalog.",
    group: "Growth",
  },
  {
    title: "Marketing",
    url: "/marketing",
    icon: Megaphone,
    description: "Campaigns, funnels and attribution.",
    group: "Growth",
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Target,
    description: "Objectives, key results and milestones.",
    group: "Growth",
  },
  {
    title: "Debt Management",
    url: "/debt-management",
    icon: TrendingDown,
    description: "Liabilities, payoff plans and interest tracking.",
    group: "Operations",
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    description: "Actions, priorities and daily execution.",
    group: "Productivity",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    description: "Meetings, events and schedule.",
    group: "Productivity",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    description: "Analytics, exports and insights.",
    group: "Growth",
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
    description: "Files, contracts and paperwork.",
    group: "Productivity",
  },
  {
    title: "Notes",
    url: "/notes",
    icon: StickyNote,
    description: "Ideas, meeting notes and knowledge base.",
    group: "Productivity",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Workspace, profile and preferences.",
    group: "System",
  },
];

export const moduleGroups = [
  "Overview",
  "Operations",
  "Growth",
  "Productivity",
  "System",
] as const;
