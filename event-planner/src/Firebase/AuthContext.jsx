import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase.jsx";              // Firebase auth објект
import { onAuthStateChanged } from "firebase/auth"; // Firebase слушач за промена на аутентификациски статус

const AuthContext = createContext(); // Креирање на контекст

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);   // Тековен корисник (null ако не е логирано)
    const [loading, setLoading] = useState(true); // Loading статус додека не се провери корисникот

    useEffect(() => {
        // Регистрира слушач кој го следи статусот на аутентификација
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);  // Постави корисникот (или null)
            setLoading(false);     // Вчитувањето завршено
        });

        // Ова ја откачува слушачот кога компонента се демаунтира
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {/* Прикажи ги children само кога не е loading */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook за користење на Auth контекстот поедноставно
export const useAuth = () => useContext(AuthContext);
