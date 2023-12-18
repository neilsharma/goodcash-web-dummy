"use client";
import { FC, useEffect, useState } from "react";
import { LocCard } from "@/shared/http/types";
import { ExposedCard } from "./ExposedCard";
import Image from "next/image";
import { motion } from "framer-motion";

const numbersMask = "××××";

export const Card: FC<{ card: LocCard }> = ({ card }) => {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [cardDetailsLoaded, setCardDetailsLoaded] = useState(false);

  useEffect(() => {
    if (showCardDetails) {
      setTimeout(() => {
        setShowCardDetails(false);
      }, 5000);
    }
  }, [showCardDetails]);

  const handleCardLinkChange = (isEmpty: boolean) => {
    setCardDetailsLoaded(isEmpty);
  };

  return (
    <motion.div
      animate={{ rotateY: showCardDetails ? 180 : 0 }}
      transition={{ duration: 1 }}
      className="relative preserve-3d perspective"
    >
      <ExposedCard card={card} onCardLinkChange={handleCardLinkChange} />
      <motion.div className=" absolute top-0 flex flex-col w-[343px] h-[200px] backface-hidden bg-darkGreen rounded-2xl p-5">
        <div
          className={`z-10 self-end ml-5 ${cardDetailsLoaded && "cursor-pointer"}`}
          onClick={() => {
            cardDetailsLoaded && setShowCardDetails(!showCardDetails);
          }}
        >
          {cardDetailsLoaded ? (
            <Image src="/img/svg/eyeOff.svg" width={16} height={16} alt="eye" />
          ) : (
            <div className="w-4 h-4 text-white">...</div>
          )}
        </div>

        <div className="px-2 py-6">
          <div className="flex justify-between items-center text-white font-sharpGrotesk text-2xl">
            <h2>{numbersMask}</h2>
            <h2>{numbersMask}</h2>
            <h2>{numbersMask}</h2>
            <h2>{card.last4 || numbersMask}</h2>
          </div>
        </div>

        <div className="px-2 flex gap-10 text-white font-sharpGrotesk text-lg mt-auto">
          <div className="flex">
            <h3 className="mr-[0.5ch] mt-1">EXP</h3>
            <h3>..</h3>
            <h3 className="mt-1">/</h3>
            <h3>..</h3>
          </div>
          <div className="flex">
            <h3 className="mr-[0.5ch] mt-1">CVV</h3>
            <h3>...</h3>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
