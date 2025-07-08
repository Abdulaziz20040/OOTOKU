import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      if (
        router.pathname !== "/auth/login" &&
        router.pathname !== "/auth/register"
      ) {
        router.push("/auth/login");
      }
    } else {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, [router.pathname]);

  if (loading) return <div>Loading...</div>;

  // Agar foydalanuvchi login qilmagan va login sahifasida bo'lmasa — hech narsa ko'rsatmaymiz
  if (
    !isLoggedIn &&
    router.pathname !== "/auth/login" &&
    router.pathname !== "/auth/register"
  ) {
    return null;
  }

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
