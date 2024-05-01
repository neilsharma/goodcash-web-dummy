import Loader from "@/components/Loader";
import appRouterServerSideHttpClient from "@/shared/http/clients/app-router/server-side";
import LOCHttpService from "@/shared/http/services/loc";
import { Suspense } from "react";
import { SpendPowerModal } from "./SpendPowerModal";
import DebitFundingCardHttpService from "@/shared/http/services/debitCard";
import { FundingCard, FundingCardState } from "@/shared/http/types";

const { getCards, getLocBalance } = new LOCHttpService(appRouterServerSideHttpClient);
const { getFundingCard } = new DebitFundingCardHttpService(appRouterServerSideHttpClient);

const moneyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const BalanceData = async () => {
  // const [card] = await getCards();
  // const balance = await getLocBalance({ locId: card.lineOfCreditId });

  // const card = {
  //   id: "card123",
  //   gcUserId: "user456",
  //   state: "ACTIVE" as CardState,
  //   lineOfCreditId: "loc789",
  //   activated: true,
  //   last4: "1234",
  //   lithicCardToken: "token123456",
  //   expirationMonth: "12",
  //   expirationYear: "2025",
  //   cardEmbodiment: "Physical",
  //   walletProvisioning: [], // Assuming an empty array for simplicity
  //   createdAt: "2023-04-01T00:00:00Z",
  // };

  const balance = {
    totalLimit: 5000,
    availableLimit: 3000,
    pendingBalance: 1000,
    outstandingBalance: 1000,
  };

  return (
    <p className="text-center font-sharpGroteskBook font-[600] text-5xl">
      {moneyFormatter.format(balance.availableLimit)}
    </p>
  );
};

const SpendPowerWrapper = async () => {
  // const fundingCard = await getFundingCard();
  const fundingCard: FundingCard = {
    id: "fundingCard123",
    state: "ACTIVE" as FundingCardState,
    last4: "1234",
    createdAt: "2023-04-01T00:00:00Z",
    updatedAt: "2023-04-02T00:00:00Z",
    deletedAt: null, // Assuming not deleted
    declineReason: null, // Assuming no decline reason
    expiryMonth: "12",
    expiryYear: "2025",
    brand: "Visa",
    type: "Credit",
  };

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
      <Suspense fallback={null}>{<SpendPowerWrapper />}</Suspense>
    </div>
  );
};
