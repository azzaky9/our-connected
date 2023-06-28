"use client";

import { useToast } from "../components/ui/toastutils/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { PiWarningFill } from "react-icons/pi";
import { FaTimesCircle } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";

type TPopUpToastProps = {
  variant: "warning" | "error" | "success" | "info";
  message: string;
  description?: string;
};

const useCustomToast = () => {
  const { toast } = useToast();

  const variantMapping: any = {
    warning: <PiWarningFill className='fill-yellow-400' />,

    error: <FaTimesCircle className='fill-red-700' />,

    success: <IoMdCheckmarkCircle className='fill-green-400' />,

    info: <BsFillInfoCircleFill className='fill-blue-600' />
  };

  const generateToast = ({ variant, message, description }: TPopUpToastProps) => {
    toast({
      action: (
        <ToastAction
          altText='success'
          className='text-2xl'>
          {variantMapping[variant]}
        </ToastAction>
      ),
      className: `border-slate-800 bg-gray-900 px-4 py-4 text-white flex justify-start items-center`,
      title: message,
      description: description
    });
  };

  return { generateToast };
};

export default useCustomToast;
