import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";

const UpdatePost = () => {
  const postCategories = [
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "React",
    "Angular",
  ];
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formdata, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setLoading(false);
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [postId]);

  const handleImageUpload = async () => {
    if (!imageFile) {
      setImageUploadError("Please select an image");
      return;
    }
    const storage = getStorage(app);
    const fileName = imageFile.name + new Date().getTime();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    try {
      setImageUploading(true);
      setImageUploadError(null);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(error.message);
          setImageUploadProgress(null);
          setImageUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageFileUrl(downloadUrl);
            setImageUploadProgress(null);
            setImageUploadError(null);
            setImageUploading(false);
            setFormData({ ...formdata, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      setImageUploadError(error.message);
      setImageUploadProgress(null);
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          {loading && <PulseLoader size={12} color="#23B6C7" />}
        </div>
      ) : (
        <div className="w-full min-h-screen mx-auto max-w-3xl p-4 my-10 space-y-5">
          <h1 className="text-3xl font-semibold">Update Post</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              <TextInput
                type="text"
                placeholder="Title"
                required
                id="title"
                className="flex-1"
                value={formdata.title}
                onChange={(e) => {
                  setFormData({ ...formdata, title: e.target.value });
                }}
              />
              <Select
                value={formdata.category}
                onChange={(e) => {
                  setFormData({ ...formdata, category: e.target.value });
                }}
                defaultValue={formdata.ca}
              >
                <option value="uncategorized">
                  Select a category
                </option>
                {postCategories.map((item) => {
                  return (
                    <option key={item} value={item.toLocaleLowerCase()}>
                      {item}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div
              className="flex gap-4 items-center justify-between border-4
        border-dotted border-teal-500 p-3"
            >
              <FileInput
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                }}
                type="file"
                accept="image/*"
              />
              <Button
                type="button"
                gradientDuoTone={"purpleToBlue"}
                size={"sm"}
                outline
                onClick={handleImageUpload}
                disabled={imageUploading}
              >
                {imageUploadProgress ? (
                  <div className="w-8 h-8">
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  "Upload image"
                )}
              </Button>
            </div>
            {imageUploadError && (
              <Alert color={"failure"}>{imageUploadError}</Alert>
            )}
            {formdata.image && (
              <img
                src={formdata.image}
                alt="upload"
                className="w-full h-72 object-cover"
                loading="lazy"
              />
            )}
            <ReactQuill
              className="h-72 mb-12"
              theme="snow"
              placeholder="Write your blog description"
              required
              value={formdata.content}
              onChange={(value) => {
                setFormData({ ...formdata, content: value });
              }}
            />
            {publishError && <Alert color={"failure"}>{publishError}</Alert>}
            <Button
              type="submit"
              gradientDuoTone={"purpleToPink"}
              disabled={imageUploading}
            >
              Save
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdatePost;
