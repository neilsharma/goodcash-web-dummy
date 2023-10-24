import appRouterServerSideHttpClient from "../../../shared/http/clients/app-router/server-side";
import UserHttpService from "../../../shared/http/services/user";
import { formatFullName, formatUSPhoneNumber, parseUserAddress } from "../../../utils/utils";
import LogoutButton from "./LogoutButton";

const { getUser } = new UserHttpService(appRouterServerSideHttpClient);
const Account = async () => {
  const user = await getUser();

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="font-kansasNewSemiBold text-primary text-2xl font-semibold text-center">
        Account
      </h1>
      <p className=" my-1 text-3xl font-sharpGroteskBook">{formatFullName(user)}</p>
      <div className=" bg-black/10 w-full h-[1px]" />
      <div className="flex w-full flex-col h-[60vh]">
        <div className="my-1">
          <h1 className=" font-sharpGroteskBook text-thinText text-sm">Phone Number</h1>
          <p className=" my-1 font-sharpGroteskMedium text-md">
            {formatUSPhoneNumber(user?.contactInfo?.phone ?? "")}
          </p>
        </div>
        <div className="my-2">
          <h1 className=" font-sharpGroteskBook text-thinText text-sm">Email Address</h1>
          <p className=" my-1 font-sharpGroteskMedium text-md">{user?.contactInfo?.email}</p>
        </div>
        <div className="my-2">
          <h1 className=" font-sharpGroteskBook text-thinText text-sm">Mailing Address</h1>
          <p className=" my-1 font-sharpGroteskMedium text-md">{parseUserAddress(user)}</p>
        </div>
        <div className="my-2 border-b border-b-black/10">
          <h1 className=" font-sharpGroteskBook text-thinText text-sm">Phone Number</h1>
          <p className=" my-1 font-sharpGroteskMedium text-md">
            {formatUSPhoneNumber(user?.contactInfo?.phone ?? "")}
          </p>
        </div>
        <div className="w-max my-2">
          <a
            href="mailto:support@goodcash.com"
            className="text-thinText hover:text-primary underline"
          >
            <p className="font-sharpGroteskBook text-md">Get Support</p>
          </a>
          <a
            href="https://bit.ly/goodcash-privacy"
            className=" text-thinText hover:text-primary underline"
            target="_blank"
          >
            <p className="my-4 font-sharpGroteskBook text-md">Terms of Service</p>
          </a>
          <a
            href="https://bit.ly/goodcash-privacy"
            className="text-thinText hover:text-primary underline"
            target="_blank"
          >
            <p className="font-sharpGroteskBook text-md">Privacy Policy</p>
          </a>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
};
export default Account;
