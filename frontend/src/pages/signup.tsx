import { useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";
import { BACKEND_URL } from "./backendurl";

export function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function signup() {
    const userName = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        userName,
        password
      });
      alert(response.data.message || "Signup successful");
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-300 flex justify-center items-center">
      <div className="bg-white rounded-lg min-w-96">
        <div className="flex flex-col gap-3 mt-2 p-6">
          <div className="text-3xl pl-16">
            <h1><b>Sign Up</b></h1>
          </div>
          <Input ref={usernameRef} placeholder="Enter Your Email" />
          <Input ref={passwordRef}  placeholder="Enter Your Password" />
          <Button onClick={signup} variant="primary" text="Submit" />
        </div>
      </div>
    </div>
  );
}
