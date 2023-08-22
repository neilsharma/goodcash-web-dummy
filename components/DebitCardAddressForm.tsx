import React, { useCallback, useEffect, useState } from "react";
import FormControlText from "./form-control/FormControlText";
import FormControlSelect from "./form-control/FormControlSelect";
import { EUsaStates } from "../shared/types";
import { IUserAddress } from "../utils/types";

interface IProps {
  setBillingAddress: (v: IUserAddress) => void;
}

const DebitCardAddressForm = (props: IProps) => {
  const { setBillingAddress } = props;

  const [zipCode, setZipCode] = useState("");
  const [stateMask, setStateMask] = useState<{ value: string; label: string } | null>(null);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");

  const memoizedSetBillingAddress = useCallback(
    (userBillingAddress: IUserAddress) => {
      setBillingAddress(userBillingAddress);
    },
    [setBillingAddress]
  );

  useEffect(() => {
    const userBillingAddress: IUserAddress = {
      addressLine1,
      addressLine2,
      state: stateMask?.label || "",
      city,
      zipCode,
    };
    memoizedSetBillingAddress(userBillingAddress);
  }, [addressLine1, addressLine2, city, memoizedSetBillingAddress, stateMask?.label, zipCode]);

  return (
    <div>
      <FormControlText
        value={addressLine1}
        onChange={(e) => {
          setAddressLine1(e.target.value);
        }}
        label="Address Line 1"
        type="text"
        maskChar={null}
        placeholder="Street address"
      />
      <FormControlText
        value={addressLine2}
        onChange={(e) => {
          setAddressLine2(e.target.value);
        }}
        label="Address Line 2"
        type="text"
        maskChar={null}
        placeholder="Apt., suit, unit number, etc. (optional)"
      />
      <FormControlSelect
        options={Object.keys(EUsaStates).map((e) => ({
          value: EUsaStates[e as keyof typeof EUsaStates],
          label: e,
        }))}
        value={stateMask}
        onChange={(v) => {
          setStateMask(v as any);
        }}
        label="State"
        placeholder="State"
        noOptionsMessage={() => null}
        containerProps={{ className: "m-0" }}
      />
      <div className="flex flex-row my-4">
        <FormControlText
          containerProps={{
            className: "m-0 mr-2",
          }}
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
          label="City"
          type="text"
          maskChar={null}
          placeholder="City"
        />
        <FormControlText
          containerProps={{
            className: "m-0 ml-2",
          }}
          value={zipCode}
          onChange={(e) => {
            setZipCode(e.target.value);
          }}
          label="Zip code"
          type="text"
          maskChar={null}
          placeholder="12345"
          inputMask="99999"
        />
      </div>
    </div>
  );
};

export default DebitCardAddressForm;
