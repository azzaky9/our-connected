"use client";

import { MailCheck } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface TVerificationSendedProp {
  email: string;
  operationSuccess?: boolean;
}

const VerificationSended: React.FC<TVerificationSendedProp> = ({ email, operationSuccess }) => {
  const delayedDesc: Array<string> = ["delayed-[1500ms]", "delayed-[1650ms]", "delayed-[1750ms]"];
  const convertFirstLast = email.split("@")[0].split("");
  const countCharCensored = new Array(convertFirstLast.length - 2).fill("*").join("");
  const displayCensored = convertFirstLast[0] + countCharCensored + convertFirstLast.at(-1);

  return (
    <div className='z-10 w-full grid place-content-center text-center absolute top-0 pt-6 px-14 gap-3'>
      <div className='w-full flex justify-center items-center'>
        <MailCheck
          className={
            "self-center  animate-template" + delayedDesc.at(0) + "opacity-0" + operationSuccess
              ? "opacity-100"
              : ""
          }
        />
      </div>
      <span
        className={`opacity-0 text-zinc-600 text-base animate-template ${delayedDesc.at(1)} ${
          operationSuccess ? "opacity-100" : null
        }`}>
        Verification link has been sent to {displayCensored + "@" + email.split("@")[1]}
      </span>
      <Link href='/register/signin'>
        <Button
          className={`bg-gray-800 hover:bg-gray-700 animate-template ${delayedDesc.at(
            2
          )} opacity-0 ${operationSuccess ? "opacity-100" : ""}`}>
          Log In
        </Button>
      </Link>
    </div>
  );
};

export default VerificationSended;
