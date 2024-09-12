import { Sidebar } from "flowbite-react"
import { HiUser, HiArrowSmRight } from "react-icons/hi"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { signOutStart, signOutSuccess, signOutFailure,} from "../state/user/userSlice";
import { useSelector, useDispatch } from "react-redux";

const DashSidebar = () => {

  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  const handleSignout = async () => {
    dispatch(signOutStart())
    try {
      const res = await fetch('/api/user/signout', {
        method:"POST"
      })
      const data = await res.json();
      if (res.ok) {
         dispatch(signOutSuccess())
      } else {
        dispatch(signOutFailure(data.message))
      }
    } catch (err) {
      dispatch(signOutFailure(err.message))
    }
  }

  return (
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/dashboard?tab=profile"}>
          <Sidebar.Item active={tab==='profile'} icon={HiUser} label={"User"} labelColor="dark" as="div">
            Profile
          </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar