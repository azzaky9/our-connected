"use client";

import React, { useState, forwardRef } from "react";
import { Label } from "../ui/label";
import { Input, InputProps } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

interface TToggleTheme extends InputProps {
  theme: "dark" | "light";
}

type Ref = HTMLInputElement;

const PasswordInputs = forwardRef<Ref, TToggleTheme>(function PasswordInputs(prop, ref) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <React.Fragment>
      <div className='relative'>
        <span
          className='absolute right-2 top-[2px] p-2 rounded-full transition duration-300 active:bg-zinc-300 cursor-pointer'
          onClick={togglePassword}>
          {showPassword ? (
            <Eye
              size={20}
              color={prop.theme === "dark" ? "#000000" : "#ffffff"}
            />
          ) : (
            <EyeOff
              size={20}
              color={prop.theme === "dark" ? "#000000" : "#ffffff"}
            />
          )}
        </span>

        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          {...prop}
        />
      </div>
    </React.Fragment>
  );
});

export default PasswordInputs;
