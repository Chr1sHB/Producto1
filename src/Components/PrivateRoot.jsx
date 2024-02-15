import { getAuth,onAuthStateChanged } from "firebase/auth";
import { useEffect,useState } from "react";
import { Navigate,useLocation, useSearchParams } from "react-router-dom";
import app from "../firebase/firebaseConfig";
import Loading from "./Loading";


const PrivateRoute = ({children}) => {
    const [isAuth, setIsAuth] = useState(false); 
    const [loading,setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const auth = getAuth(app);
        const unSuscribed = onAuthStateChanged(auth, (user) => {
            setIsAuth(!!user);
            setLoading(false);
        })
        return () => unSuscribed();
    },[]);

    if (loading){
        return <Loading></Loading>
    }

    return isAuth ? ( 
        children
    ) : (
        <Navigate to="/login" state={{from: location}}/>
    )

}


export default PrivateRoute;