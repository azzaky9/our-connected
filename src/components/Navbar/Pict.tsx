import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const Pict = () => {
  const { user } = useAuth();

  const initial = user?.email.at(0);

  return (
    <div className='flex gap-3'>
      <Avatar>
        <AvatarImage
          src=''
          alt={`@${initial}`}
        />
        <AvatarFallback className='text-white bg-rose-600'>{initial}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Pict;
