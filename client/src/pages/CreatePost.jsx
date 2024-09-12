import { Button, FileInput, Select, TextInput } from "flowbite-react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
    const postCategories = ["JavaScript","TypeScript","HTML", "CSS", "React", "Angular"]
  return (
    <div className="w-full min-h-screen mx-auto max-w-3xl p-4 space-y-5">
      <h1 className="text-3xl font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <TextInput type="text" placeholder="Title" required id="title" className="flex-1" />
            <Select>
                <option value={"uncategorized"} disabled>Select a category</option>
                {
                    postCategories.map((item) => {
                        return <option key={item} value={item.toLocaleLowerCase()}>{item}</option>
                    })
                }
            </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4
        border-dotted border-teal-500 p-3">
            <FileInput type='file' accept="image/*" />
            <Button type="button" gradientDuoTone={'purpleToBlue'} size={'sm'} outline>
                Upload image
            </Button>
        </div>
        <ReactQuill
        className="h-72 mb-12"
        theme="snow" placeholder="Write your blog description"
        required />
        <Button type="submit" gradientDuoTone={'purpleToPink'}>Publish</Button>
      </form>
    </div>
  )
}

export default CreatePost