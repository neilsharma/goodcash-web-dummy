"use client";

import appRouterClientSideHttpClient from "@/shared/http/clients/app-router/client-side";
import LOCHttpService from "@/shared/http/services/loc";
import { LocCard } from "@/shared/http/types";
import Image from "next/image";
import { FC, useCallback, useMemo, useRef, useState } from "react";

const { getCardLink } = new LOCHttpService(appRouterClientSideHttpClient);

export const ExposedCard: FC<{ card: LocCard }> = ({ card }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [cardLink, setCardLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoaded = useMemo(() => !!cardLink && !isLoading, [cardLink, isLoading]);

  const loadCard = useCallback(() => {
    setIsLoading(true);
    getCardLink({ cardId: card.id }).then((l) => setCardLink(l));
  }, [card.id, setCardLink]);

  return (
    <>
      <Image
        src="/img/svg/eyeOff.svg"
        width={16}
        height={16}
        alt="eye"
        className="z-10 ml-auto cursor-pointer"
        style={{ opacity: isLoading || cardLink ? 0 : "inherit" }}
        onClick={() => {
          if (!isLoading && !cardLink) loadCard();
        }}
      />
      {cardLink && (
        <iframe
          ref={iframeRef}
          height={200}
          width={343}
          style={{ opacity: isLoaded ? "inherit" : 0 }}
          className="z-20 absolute top-0 left-0"
          src={cardLink}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </>
  );
};
