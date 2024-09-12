import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSucces,
  updateFailure,
  deleteStart,
  deleteSuccuss,
  deleteFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../state/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploaError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [userUpdateSuccessfull, setUserUpdateSuccessfull] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filePickerRef = useRef();

  const [formdata, setFormdata] = useState({});
  const dispatch = useDispatch();
  const [userUpdateError, setUserUpdateError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = imageFile.name + new Date().getTime();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploading(false);
        setImageFileUploadError(
          "Unable to upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormdata({ ...formdata, profilePicture: downloadUrl });
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formdata).length === 0) {
      return;
    }

    if (imageFileUploading) {
      return;
    }

    setUserUpdateError(null);
    setUserUpdateSuccessfull(null);

    try {
      dispatch(updateStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUserUpdateError(error);
      } else {
        dispatch(updateSucces(data));
        setUserUpdateSuccessfull("Profile updated successfuly");
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
      setUserUpdateError(error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const result = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await result.json();
      if (result.ok) {
        dispatch(deleteSuccuss(data));
      } else {
        dispatch(deleteFailure(data.message));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signOutSuccess());
      } else {
        dispatch(signOutFailure(data.message));
      }
    } catch (err) {
      dispatch(signOutFailure(err.message));
    }
  };

  return (
    <div className="w-full mx-auto max-w-4xl p-4 space-y-5">
      <h1 className="text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdateFormSubmit}>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          name=""
          id=""
          onChange={handleImageUpload}
          ref={filePickerRef}
        />
        <div className="relative mb-12">
          <div
            className="relative h-40 bg-gradient-to-r from-indigo-500
        via-purple-500 to-pink-500 rounded-lg shadow"
          >
            <div className="absolute h-32 w-32 left-0 right-0 mx-auto sm:mx-0 -bottom-10 sm:left-10 cursor-pointer shadow-md rounded-full overflow-hidden group">
              {imageFileUploadProgress && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62,152,199, ${
                        imageFileUploadProgress / 100
                      })`,
                    },
                    text: {
                      fill: "#ffffff",
                    },
                  }}
                />
              )}
              <img
                src={imageFileUrl || currentUser.profilePicture}
                alt={currentUser.username}
                className={`w-full h-full object-cover border-4 border-[white] rounded-full group-hover:border-[transparent] transition duration-150 ease-in-out 
                    ${
                      imageFileUploadProgress &&
                      imageFileUploadProgress < 100 &&
                      "opacity-20"
                    }
                `}
                onClick={() => filePickerRef.current.click()}
              />
            </div>
          </div>
        </div>
        {imageFileUploaError && (
          <Alert color={"failure"}>{imageFileUploaError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={(e) => {
            setFormdata({
              ...formdata,
              username: e.target.value,
            });
          }}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          required
          defaultValue={currentUser.email}
          onChange={(e) => {
            setFormdata({
              ...formdata,
              email: e.target.value,
            });
          }}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => {
            setFormdata({
              ...formdata,
              password: e.target.value,
            });
          }}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          disabled={loading || imageFileUploading}
          outline
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="text-sm text-white pl-3">Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        {
          currentUser && currentUser.isAdmin && (
            <Link className="w-full" to={"/create-post"}>
              <Button className="w-full" gradientDuoTone="purpleToPink">Create a Post</Button>
            </Link>
          )
        }
      </form>
      {userUpdateError && (
        <Alert className="mt-5" color={"failure"}>
          {userUpdateError}
        </Alert>
      )}
      {userUpdateSuccessfull && (
        <Alert className="mt-5" color={"success"}>
          {userUpdateSuccessfull}
        </Alert>
      )}
      {error && (
        <Alert className="mt-5" color={"failure"}>
          {error}
        </Alert>
      )}
      <div className="text-sm text-red-500 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
        <span
          onClick={() => {
            setShowModal(true);
          }}
          className="cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={() => {
            handleSignout();
          }}
          className="cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      <Modal
        show={showModal}
        className="bg-blend-darken"
        onClose={() => {
          setShowModal(false);
        }}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body clas>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="text-gray-400 dark:text-gray-200 mx-auto mb-2"
              size={50}
            />
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => {
                  handleDeleteUser;
                }}
                color={"failure"}
              >
                Yes, I&#39;m sure
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
                color={""}
                outline
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
