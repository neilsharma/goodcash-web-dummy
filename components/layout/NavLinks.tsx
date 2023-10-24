"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import tailwindConfig from "@/tailwind.config";
import Dollar from "../icons/Dollar";
import CreditCard from "../icons/CreditCard";
import Profile from "../icons/Profile";

const colors = tailwindConfig.theme.extend.colors;

export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <ul className="my-12 flex flex-col justify-center gap-2">
      {routes.map(({ name, icon: Icon, path }) => {
        const isActive = pathname?.startsWith(path);

        return (
          <li className="my-2 p-3" key={name}>
            <Link href={path} className="flex items-center gap-2">
              <Icon iconColor={isActive ? colors.primary : colors.thinText} />
              <p className={`${isActive ? "text-primary" : "text-thinText"} text-sm`}>{name}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

const routes = [
  {
    name: "Home",
    icon: Dollar,
    path: "/home",
  },
  {
    name: "Transactions",
    icon: CreditCard,
    path: "/transactions",
  },
  {
    name: "Account",
    icon: Profile,
    path: "/account",
  },
];
