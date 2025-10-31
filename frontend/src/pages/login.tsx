import { useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";
import { BACKEND_URL } from "./backendurl";
import { useNavigate } from "react-router-dom";

export function LogIn() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function login() {
    const userName = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!userName || !password) {
      alert("Please fill in both fields");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/login`, {
        userName,
        password,
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-300 flex justify-center items-center">
      <div className="bg-white rounded-lg min-w-96">
        <div className="flex flex-col gap-3 mt-2 p-6">
          <div className="text-3xl pl-16 text-violet-600">
            <h1><b>Log In</b></h1>
          </div>
          <Input ref={usernameRef} placeholder="Enter Your Email" />
          <Input ref={passwordRef} placeholder="Enter Your Password" />
          <Button onClick={login}  variant="secondary" text="Submit" />
        </div>
      </div>
    </div>
  );
}
