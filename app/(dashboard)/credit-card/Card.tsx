import { FC } from "react";
import { LocCard } from "@/shared/http/types";
import { ExposedCard } from "./ExposedCard";

const numbersMask = "××××";

export const Card: FC<{ card: LocCard }> = async ({ card }) => {
  return (
    <div className="relative">
      <div className="flex flex-col w-[343px] h-[200px] bg-darkGreen rounded-2xl p-5">
        <ExposedCard card={card} />

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
      </div>
    </div>
  );
};
