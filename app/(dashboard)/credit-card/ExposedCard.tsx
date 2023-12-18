"use client";

import appRouterClientSideHttpClient from "@/shared/http/clients/app-router/client-side";
import LOCHttpService from "@/shared/http/services/loc";
import { LocCard } from "@/shared/http/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

const { getCardLink } = new LOCHttpService(appRouterClientSideHttpClient);

export const ExposedCard: FC<{ card: LocCard; onCardLinkChange: (isEmpty: boolean) => void }> = ({
  card,
  onCardLinkChange,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [cardLink, setCardLink] = useState<string | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const isLoaded = useMemo(() => !!cardLink && !isLoading, [cardLink, isLoading]);

  const loadCard = useCallback(() => {
    setIsLoading(true);
    getCardLink({ cardId: card.id }).then((l) => {
      setCardLink(l);
    });
  }, [card.id]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  return (
    <>
      <Image
        src="/img/svg/eyeOff.svg"
        width={16}
        height={16}
        alt="eye"
        className="ml-auto cursor-pointer"
        style={{ opacity: isLoading || cardLink ? 0 : "inherit" }}
        onClick={() => {
          setIsLoading(!isLoading);
        }}
      />

      <div className="relative">
        <div className="flex flex-col justify-center items-center w-[343px] h-[200px] bg-darkGreen rounded-2xl p-5">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      </div>

      <motion.iframe
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 180 }}
        transition={{ delay: 0.5 }}
        ref={iframeRef}
        height={200}
        width={343}
        style={{ opacity: isLoaded ? "inherit" : 0 }}
        className="z-10 absolute top-0 left-0 preserve-3d perspective backface-hidden"
        src={cardLink}
        onLoad={() => {
          setIsLoading(false);
          onCardLinkChange(!!cardLink);
        }}
      />
    </>
  );
};
