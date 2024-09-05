import { Button } from "flowbite-react"
import {AiFillGoogleCircle } from 'react-icons/ai'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../state/user/userSlice"
import { useNavigate } from "react-router-dom"

const OAuth = () => {
    const dispatch = useDispatch();
    const auth = getAuth(app);
    const navigate = useNavigate();
    const handleClick = async () => {  
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({
            prompt: 'select_account'
        })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    name:resultsFromGoogle.user.displayName,
                    email:resultsFromGoogle.user.email,
                    googlePhotoUrl:resultsFromGoogle.user.photoURL
                })
            })
            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate("/");
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Button type="button" gradientDuoTone={'pinkToOrange'} outline
    onClick={handleClick}>
        <div className="flex items-center gap-2">
        <AiFillGoogleCircle className="h-6 w-6" />
        <span>Continue in with Google</span>
        </div>
    </Button>
  )
}

export default OAuth