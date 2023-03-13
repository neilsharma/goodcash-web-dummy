import React from "react";
import { goodcashEnvironment } from "../../shared/config";

const CQRPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <h1 className=" font-kansasNewSemiBold text-4xl">Welcome to goodcash</h1>
      <p className=" font-sharpGroteskBook mt-10 text-lg">Redirecting to Goodcash App</p>
      <button
        onClick={() => {
          if (goodcashEnvironment === "sandbox") {
            document.location = "goodcashsandbox://home";
          } else {
            document.location = "goodcash://home";
          }
        }}
        className="bg-[#6BC799] p-4 rounded-lg text-white font- mt-4"
      >
        Click to redirect
      </button>
    </div>
  );
};

export default CQRPage;
