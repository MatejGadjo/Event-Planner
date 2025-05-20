import { auth } from "../Firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Logout = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 0);
        } catch (error) {
            console.error(error.message);
        }
    };

    if (!user) {
        return (
            <Link to="/login" className="navbar-button">
                НАЈАВИ СЕ
            </Link>
        );
    }

    return (
        <button onClick={handleLogout} className="navbar-button">
            ОДЈАВИ СЕ
        </button>
    );
};

export default Logout;
