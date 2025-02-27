import { auth } from "../FireBase/firebase";
import { signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <button onClick={handleLogout} className={"navbar-button"}>
            ОДЈАВИ СЕ
        </button>

    );};

export default Logout;
