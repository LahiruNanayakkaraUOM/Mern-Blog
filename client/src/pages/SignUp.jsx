import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row gap-5 md:items-center">
        <div className="flex-1">
          <Link
            to="/"
            className="self-center whitespace-nowrap text-4xl font-semibold dark:text-white"
          >
            <span
              className="px-2 py-1 bg-gradient-to-r from-indigo-500
        via-purple-500 to-pink-500 rounded-lg text-white me-"
            >
              Lahiru&#39;s
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Not the answer you&#39;re looking for? Browse other questions tagged
            csstailwind-css or ask your own question.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label value="Username"></Label>
              <TextInput 
              type="text"
              placeholder="Please enter your username"
              id="username"
              ></TextInput>
            </div>

            <div className="flex flex-col gap-2">
              <Label value="Email"></Label>
              <TextInput 
              type="email"
              placeholder="Please enter your email"
              id="email"
              ></TextInput>
            </div>

            <div className="flex flex-col gap-2">
              <Label value="Password"></Label>
              <TextInput 
              type="password"
              placeholder="Please enter your password"
              id="password"
              ></TextInput>
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">Sign Up</Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500 underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
