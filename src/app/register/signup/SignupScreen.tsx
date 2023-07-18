import React from "react";
import CreateNewUserForm from "@/components/form/CreateNewUser";

const SignupScreen = () => {
  return (
    <section className='grid place-content-center text-white'>
      <CreateNewUserForm />
    </section>
  );
};

export default SignupScreen;