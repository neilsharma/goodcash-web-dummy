import Loader from "@/components/Loader";
import appRouterServerSideHttpClient from "@/shared/http/clients/app-router/server-side";
import LOCHttpService from "@/shared/http/services/loc";
import { Suspense } from "react";
import { SpendPowerModal } from "./SpendPowerModal";
import DebitFundingCardHttpService from "@/shared/http/services/debitCard";

const { getCards, getLocBalance } = new LOCHttpService(appRouterServerSideHttpClient);
const { getFundingCard } = new DebitFundingCardHttpService(appRouterServerSideHttpClient);

const moneyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const BalanceData = async () => {
  const [card] = await getCards();
  const balance = await getLocBalance({ locId: card.lineOfCreditId });

  return (
    <p className="text-center font-sharpGroteskBook font-[600] text-5xl">
      {moneyFormatter.format(balance.availableLimit)}
    </p>
  );
};

const SpendPowerWrapper = async () => {
  const fundingCard = await getFundingCard();

  return <SpendPowerModal fundingCard={fundingCard} />;
};

export const Balance = () => {
  return (
    <div className="my-10 text-center">
      <h2 className="font-kansasNewSemiBold text-thinText text-2xl font-semibold text-center my-3">
        Spend Power
      </h2>
      <Suspense fallback={<Loader svgProps={{ className: "w-8 h-8" }} />}>
        <BalanceData />
      </Suspense>
      <Suspense fallback={null}>
        <SpendPowerWrapper />
      </Suspense>
    </div>
  );
};
