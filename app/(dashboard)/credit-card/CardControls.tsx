"use client";

import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Switch from "react-switch";
import { CardState, LocCard } from "@/shared/http/types";
import config from "@/tailwind.config";
import appRouterClientSideHttpClient from "@/shared/http/clients/app-router/client-side";
import LOCHttpService from "@/shared/http/services/loc";

const colors = config.theme.extend.colors;
const { getCards, freezeAllCards, unfreezeAllCards } = new LOCHttpService(
  appRouterClientSideHttpClient
);

interface ButtonProps {
  title: string;
  onClick?: () => any;
  link?: string;
  icon: ReactNode;
}

const Button: FC<ButtonProps> = ({ title, icon, onClick, link }) => {
  return (
    <a
      className="flex flex-row justify-between items-center pt-4 pb-4 cursor-pointer"
      onClick={onClick}
      href={link}
    >
      <div className="flex flex-row items-center">
        {icon}
        <p className="text-base font-sharpGrotesk ml-4 text-black">{title}</p>
      </div>
      <Image src="/img/svg/chevronRight.svg" width={17} height={16} alt=">" />
    </a>
  );
};

export const CardControls: FC<{ card: LocCard }> = ({ card: providedCard }) => {
  const [card, setCard] = useState(providedCard);
  const cardIsFrozen = useMemo(() => card.state === CardState.PAUSED, [card.state]);
  const [operationPending, setOperationPending] = useState(false);

  const toggleFreeze = useCallback(async () => {
    try {
      setOperationPending(true);
      const props = { locId: card.lineOfCreditId };
      cardIsFrozen ? await unfreezeAllCards(props) : await freezeAllCards(props);
      const [newCard] = await getCards();
      setCard(newCard);
      setOperationPending(false);
    } catch {
      setOperationPending(false);
    }
  }, [setCard, setOperationPending, card.lineOfCreditId, cardIsFrozen]);

  return (
    <div className="my-8 w-96">
      <div className="flex flex-row justify-between items-center pt-4 pb-4">
        <div className="flex flex-row items-center pr-4">
          <Image src="/img/svg/blackLock.svg" width={24} height={24} alt="🔒" />
          <div className="flex flex-col justify-flex-start ml-4">
            <p className="text-sm font-sharpGrotesk text-black">Freeze card</p>
            <p className="text-xs text-text2 font-sharpGrotesk">
              Prevent your card from use.
              <br />
              Turn on and off any time you want.
            </p>
          </div>
        </div>

        <Switch
          disabled={operationPending}
          onColor={colors.primary}
          uncheckedIcon={false}
          checkedIcon={false}
          checked={cardIsFrozen}
          onChange={toggleFreeze}
        />
      </div>
      <Button
        icon={<Image src="/img/svg/alertCircle.svg" width={24} height={24} alt="!" />}
        link="mailto:support@goodcash.com?subject=Report%20Lost%20Card&body=Description"
        title="Contact Support"
      />
    </div>
  );
};
