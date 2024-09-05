/* eslint-disable no-unused-vars */
import { Alert, Button, Label, TextInput, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../state/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error:errorMessage } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("All fields are required"));
    }

    if (formData.password.length < 8) {
      return dispatch(signInFailure("Password should be at leaset 8 characters"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate("/home");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row gap-5">
        <div className="flex-1 md:pt-20">
          <Link
            to="/"
            className="self-center whitespace-nowrap text-4xl font-semibold dark:text-white"
          >
            <span
              className="px-2 py-1 bg-gradient-to-r from-indigo-500
        via-purple-500 to-pink-500 rounded-lg text-white me-4"
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <div className="flex flex-col gap-2">
              <Label value="Email"></Label>
              <TextInput
                type="email"
                placeholder="Please enter your email"
                id="email"
                onChange={handleChange}
              ></TextInput>
            </div>

            <div className="flex flex-col gap-2">
              <Label value="Password"></Label>
              <TextInput
                type="password"
                placeholder="Please enter your password"
                id="password"
                onChange={handleChange}
              ></TextInput>
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                <Spinner size="sm" />
                <span className="text-sm text-white pl-3">Loading...</span>
              </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don&#39;t have an account?</span>
            <Link to="/sign-up" className="text-blue-500 underline">
              Sign up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
