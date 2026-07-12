import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-medium">Signing you in with Google...</p>
    </main>
  );
};

export default OAuthSuccess;