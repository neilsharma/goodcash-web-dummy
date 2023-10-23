"use client";

import { FC, useState } from "react";
import Modal from "react-modal";
import { X } from "react-feather";

import tailwindConfig from "@/tailwind.config";
import Image from "next/image";
import type { FundingCard } from "@/shared/http/types";

Modal.setAppElement("#modal");

export const SpendPowerModal: FC<{ fundingCard: FundingCard | null }> = ({ fundingCard }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h3 className="text-primary my-2" onClick={() => setIsOpen(true)}>
        <Image
          src="/img/svg/info.svg"
          height={14}
          width={14}
          alt="i"
          className="inline mr-1 mb-[0.1rem]"
        />
        How we calculate spend power
      </h3>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            maxWidth: "1000px",
            minHeight: "80vh",
          },
        }}
      >
        <div className="relative pb-8">
          <X
            className="absolute top-0 left-0 cursor-pointer"
            color={tailwindConfig.theme.extend.colors.thinText}
            onClick={() => setIsOpen(false)}
          />
          <h1 className="text-center m-2 text-2xl text-primary font-kansasNewSemiBold">
            Spend Power
          </h1>
        </div>
        <h2 className="text-lg">What is Spend Power?</h2>
        <p className="text-sm my-4">
          {fundingCard
            ? "Your spend power is the amount of dollars that is safe to spend on your GoodCash card."
            : "Your spend power is the maximum spend limit on your GoodCash card. " +
              "You can only spend the minimum between what you have available on your debit card and your spend power."}
        </p>

        {fundingCard ? (
          <>
            <h2 className="text-lg mt-6">Why is my Spend Power lower than my bank balance?</h2>
            <p className="text-sm my-4">
              Similar to how your bank’s debit card has a daily spend limit, the daily spend limit
              is often lower than your bank balance to minimize risk.
              <br />
              <br />A lower Spend Power also helps you stay out of debt while building credit.
            </p>

            <h2 className="text-lg mt-6">When does my Spend Power replenish?</h2>
            <p className="text-sm my-4">
              GoodCash automatically debits your connected bank account every day via AutoPay to
              replenish your Spend Power.
              <br />
              <br />
              Daily Debits can take 3-5 days to transfer from your account to GoodCash.
              <br />
              <br />
              When the Daily Debit reaches GoodCash, your Spend Power will be replenished.
            </p>
          </>
        ) : null}
      </Modal>
    </>
  );
};
