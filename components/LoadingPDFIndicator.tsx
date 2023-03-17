import { useState, useEffect } from "react";

export const LoadingPDFIndicator = () => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAmount((p) => {
        if (p >= 99) clearInterval(intervalId);
        return p + 1;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [setAmount]);

  return (
    <div className="flex items-center justify-center flex-col bg-white rounded-3xl max-w-[343px] py-20 my-10 mx-auto gap-6">
      <p className="font-kansasNew text-lg">PDF</p>

      <div>
        <div className="w-1/3 min-w-[161px] bg-black/[.1] rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full filter brightness-110"
            style={{ width: `${amount}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 font-sharpGroteskBook text-xs text-thinText">Loading...</p>
      </div>
    </div>
  );
  // return <progress className="h-2 b" value={amount} max={100} />;
};

export default LoadingPDFIndicator;
