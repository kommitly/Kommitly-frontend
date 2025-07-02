// VerifyRedirect.jsx (or inside your route handling)
import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const VerifyRedirect = () => {
  const [searchParams] = useSearchParams();
  const access = searchParams.get("access");
  const { login } = useContext(AuthContext);

 
  


  const navigate = useNavigate();

  useEffect(() => {
    if (access) {

        console.log("Access token received:", access);
        
    

      login(access); // this also saves to localStorage and fetches user
    } else {
      navigate("/registration"); // fallback
    }
  }, [access, login, navigate]);

  return <p>Verifying your account and redirecting...</p>;
};

export default VerifyRedirect;
