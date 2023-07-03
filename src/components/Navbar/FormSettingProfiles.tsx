import { Pict } from "./index";

interface FormSettingProfilesProps {
  isEdit: boolean;
}

const FormSettingProfiles: React.FC<FormSettingProfilesProps> = ({ isEdit }) => {
  return (
    <form
      className='grid gap-4'
      onSubmit={() => console.log("submitted")}>
      <Pict />

      <div>
        <h5 className='mb-2'>Email</h5>
        <h5 className='text-sm text-zinc-500'></h5>
      </div>
    </form>
  );
};

export default FormSettingProfiles;
