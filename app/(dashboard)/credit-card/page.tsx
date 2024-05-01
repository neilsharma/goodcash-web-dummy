import LOCHttpService from "@/shared/http/services/loc";
import { Card } from "./Card";
import appRouterServerSideHttpClient from "@/shared/http/clients/app-router/server-side";
import { CardControls } from "./CardControls";
import { LocCard, CardState } from "@/shared/http/types";

const { getCards } = new LOCHttpService(appRouterServerSideHttpClient);

export default async function CreditCardPage() {
  // const [card] = await getCards();

  const card: LocCard = {
    id: "card123",
    gcUserId: "user456",
    state: CardState.OPEN,
    lineOfCreditId: "loc789",
    activated: true,
    last4: "1234",
    lithicCardToken: "token123456",
    expirationMonth: "12",
    expirationYear: "2025",
    cardEmbodiment: "Physical",
    walletProvisioning: [], // Assuming an empty array for simplicity
    createdAt: "2023-04-01T00:00:00Z",
  };

  // const card2: LocCard = {
  //   id: "card456",
  //   gcUserId: "user789",
  //   state: CardState.PENDING_ACTIVATION,
  //   lineOfCreditId: "loc101112",
  //   activated: false,
  //   last4: "5678",
  //   lithicCardToken: "token789012",
  //   expirationMonth: "06",
  //   expirationYear: "2026",
  //   cardEmbodiment: "Virtual",
  //   walletProvisioning: [], // Assuming an empty array for simplicity
  //   createdAt: "2023-04-02T00:00:00Z",
  // };

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-kansasNewSemiBold text-primary text-4xl font-semibold text-center mb-6">
        Credit Card
      </h1>
      <Card card={card} />
      <CardControls card={card} />
    </div>
  );
}
