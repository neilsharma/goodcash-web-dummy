import LOCHttpService from "@/shared/http/services/loc";
import { Card } from "./Card";
import appRouterServerSideHttpClient from "@/shared/http/clients/app-router/server-side";
import { CardControls } from "./CardControls";

const { getCards } = new LOCHttpService(appRouterServerSideHttpClient);

export default async function CreditCardPage() {
  const [card] = await getCards();

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
