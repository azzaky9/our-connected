import SignupScreen from "@/components/RegisterUi/SignupScreen";

const page = () => {
  return (
    <main className='grid place-content-center gap-5 h-screen'>
      <h1 className='text-center text-2xl font-semibold text-slate-50'>Create New Account</h1>
      <SignupScreen />
    </main>
  );
};

export default page;
