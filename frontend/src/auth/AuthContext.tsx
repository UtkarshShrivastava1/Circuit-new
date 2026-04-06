

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
// import * as jwt_decode from "jwt-decode";
import API from "@/api/axios";

type User = {
  name: string;
  email: string;
  role: string;
  organization: string;
};

type AuthState = {
  user: User | null;
  slug: string | null;
};

// type AuthState = {
//   token: string | null;
//   slug: string | null;
//   role: string | null;
//   userId: string | null;
// };

// type DecodedToken = {
//   userId: string;
//   organization: string;
//   role: string;
//   iat: number;
//   exp: number;
// }; 

type AuthContextType = {
  auth: AuthState;
  login:  (data: { user: User; slug: string }) => void;
  logout: () => void;
};

// const getInitialAuth = (): AuthState => {
//   const stored = localStorage.getItem("auth");
//   console.log("stored" ,stored );
//   if (stored) {
//     try {
//       return JSON.parse(stored);
//     } catch (e) {
//       console.warn("Failed to parse auth from localStorage:", e);
//     }
//   }
//   return { token: null, slug: null, role: null, userId: null };
// };

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

   const [auth, setAuth] = useState<AuthState>({
    user: null,
    slug: null,
  });

  const [loading, setLoading] = useState(true);

  //  Check login on refresh using cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
       const res = await API.get("/auth/me");

        //  console.log("User from /me:", res.data);
        //  console.log("User's slug:", res.data.slug);

        // Update AuthContext
        setAuth({
          user: res.data.user,
          slug: res.data.slug,
        });
      } catch (err) {
        setAuth({
          user: null,
          slug: null,
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  
  const login = (data: { user: User; slug: string }) => {
    const newAuth = {
      user: data.user,
      slug: data.slug,
    };

    setAuth(newAuth);
   

  };



  // const [auth, setAuth] = useState<AuthState>(getInitialAuth);

  // const login = (data: { token: string; slug: string }) => {
  //   let role: string | null = null;
  //   let userId: string | null = null;

  //   try {
  //     // ✅ Decode JWT safely
  // const payload = (jwt_decode as any)(data.token) as DecodedToken;
  // console.log("payload", payload);
 
  //     role = payload.role ? payload.role.toLowerCase() : null; // fallback if undefined
  //     userId = payload.userId ?? null;
      
  //   } catch (e) {
  //     console.warn("Failed to decode token:", e); 
  //   }

  //   const newAuth: AuthState = {
  //     token: data.token,
  //     slug: data.slug,
  //     role,
  //     userId,
  //   };

  //   setAuth(newAuth);
  //   localStorage.setItem("auth", JSON.stringify(newAuth));
  // };

  // const logout = () => {
  //   setAuth({
  //     token: null,
  //     slug: null,
  //     role: null,
  //     userId: null,
  //   });
  //   localStorage.removeItem("auth");
  // };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }

    setAuth({
      user: null,
      slug: null,
    });
  };



  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};