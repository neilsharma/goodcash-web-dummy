"use client";

import { useRouter } from "next/navigation";
import { userLogoutHandler } from "../../utils";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { useState } from "react";

const LogoutButton = () => {
  const { refresh } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const handleUserLogout = async () => {
    await userLogoutHandler().then(refresh);
  };

  return (
    <div>
      <LogoutConfirmationModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        onConfirm={handleUserLogout}
      />
      <div className="border-b border-b-black/10 h-[1px] my-2 hover:cursor-pointer" />
      <div className="w-max cursor-pointer my-2">
        <a onClick={() => setIsOpen(true)} className="text-error hover:text-error/80">
          <p className="font-sharpGroteskMedium text-md">Log Out</p>
        </a>
      </div>
    </div>
  );
};

export default LogoutButton;
