import Image from "next/image";
import { NavLinks } from "./NavLinks";

export const Header = () => (
  <header className="flex justify-center mt-8 mb-[7vh]">
    <Image src="/img/logo/goodcash.svg" alt="GoodCash" width={106} height={16} priority={true} />
  </header>
);

export const NavHeader = () => {
  return (
    <header className="border-r-[1px] border-r-gray-300 w-60">
      <nav className="flex flex-col items-center">
        <Image
          className="my-4"
          src="/img/logo/goodcash.svg"
          alt="GoodCash"
          width={106}
          height={16}
          priority={true}
        />

        <NavLinks />
      </nav>
    </header>
  );
};
