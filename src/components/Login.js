import React, { useState } from "react";
import { auth } from "./Firebase"; // Import your Firebase config
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission

    setError(null);
    setEmailError(null);
    setPasswordError(null);

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    // Sign in the user with email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in:", user);
        navigate("/Gallery");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-login-credentials") {
          setEmailError("Incorrect email or password.");
        } else if (errorCode === "auth/network-request-failed") {
          setError("error_internet_disconnected");
        } else if (errorCode === "auth/wrong-password") {
          setPasswordError("Incorrect email or password.");
        } else {
          console.error("Error signing in:", error);
        }
      });
  };

  return (
    <>
      <header>
        <h1>
          <img src="/assets/image-.png" alt="" />
          DnD Gallery.
        </h1>
      </header>
      <form onSubmit={handleLogin}>
        <div className="container">
          <label htmlFor="email">
            <b>Email</b>
            {error && <span className="error-message">{error}</span>}
            {emailError && <span className="error-message">{emailError}</span>}
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
          </label>
          <input
            type="text"
            placeholder="Enter Email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login">
            Login
          </button>
        </div>

        <div className="container" style={{ backgroundColor: "#f1f1f1" }}>
          <Link to="/Signup">
            <button type="button" className="cancelbtn">
              Sign Up
            </button>
          </Link>
          <span className="psw">
            Forgot <a href="/">password?</a>
          </span>
        </div>
      </form>
    </>
  );
}
