
import { ShoppingCart, MapPin, Users, Gift } from "lucide-react";
import { Category } from "./types";

export const categories: Category[] = [
  {
    title: "Marketplace",
    description: "Buy and sell items with fellow students",
    icon: ShoppingCart,
    href: "/marketplace",
    color: "bg-blue-500"
  },
  {
    title: "Housing",
    description: "Find housing, subletting, and roommates",
    icon: MapPin,
    href: "/housing",
    color: "bg-green-500"
  },
  {
    title: "Services",
    description: "Offer or find tutoring and other services",
    icon: Users,
    href: "/services",
    color: "bg-purple-500"
  },
  {
    title: "Donations",
    description: "Donate items to those in need",
    icon: Gift,
    href: "/donations",
    color: "bg-orange-500"
  }
];
