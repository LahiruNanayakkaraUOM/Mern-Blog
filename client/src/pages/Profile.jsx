import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="w-full mx-auto max-w-4xl p-4 space-y-5">
      <h1 className="text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="relative mb-12">
          <div
            className="relative h-40 bg-gradient-to-r from-indigo-500
        via-purple-500 to-pink-500 rounded-lg shadow"
          >
            <div className="absolute h-32 w-32 left-0 right-0 mx-auto sm:mx-0 -bottom-10 sm:left-10 cursor-pointer shadow-md rounded-full overflow-hidden group">
            <img
              src={currentUser.profilePicture}
              alt={currentUser.username}
              className="w-full h-full object-cover border-4 border-[white] rounded-full group-hover:border-[transparent] transition duration-150 ease-in-out"
            />
            </div>
          </div>
        </div>
        <TextInput type="text" id="username" placeholder="Username" 
        defaultValue={currentUser.username}
        />
        <TextInput type="email" id="email" placeholder="Email" 
        defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="Password"
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>Save Changes</Button>
      </form>
      <div className="text-sm text-red-500 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
