import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { userLogout } from "../redux/slices/authSlice";

export const CheckTokenExpiry = (dispatch, navigate) => {
  const token = Cookies.get("token");
  if (!token) {
    dispatch(userLogout());
    Cookies.remove("token");
    navigate("/signin");
    return;
  }

  try {
    const { exp } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (exp < currentTime) {
      dispatch(userLogout());
      Cookies.remove("token");
      navigate("/signin");
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    dispatch(userLogout());
    Cookies.remove("token");
    navigate("/signin");
  }
};
