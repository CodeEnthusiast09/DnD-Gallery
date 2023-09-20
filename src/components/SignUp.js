import React, { useState } from "react";
import { auth } from "./Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState(null);

  const signUp = () => {
    // Clear previous error messages
    setError(null);
    setEmailError(null);
    setPasswordError(null);
    setRepeatPasswordError(null);

    // Check email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!emailPattern.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    // Check password length
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // Check password match
    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User signed up successfully
        const user = userCredential.user;
        console.log("User signed up:", user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          // Email is already in use, display an error message
          setEmailError("Email is already in use.");
        } else if (errorCode === "auth/network-request-failed") {
          setError("error_internet_disconnected");
        } else {
          // Handle other errors
          setEmailError("Error signing up: " + error.message);
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
      <form className="signup">
        <div className="container">
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
          <hr />
          <div className="form-group">
            <label htmlFor="email">
              <b>Email</b>
              {error && <span className="error-message">{error}</span>}
              {emailError && (
                <span className="error-message">{emailError}</span>
              )}
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="psw">
              <b>Password</b>
              {passwordError && (
                <span className="error-message">{passwordError}</span>
              )}
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="psw-repeat">
              <b>Repeat Password</b>
              {repeatPasswordError && (
                <span className="error-message">{repeatPasswordError}</span>
              )}
            </label>
            <input
              type="password"
              placeholder="Repeat Password"
              name="psw-repeat"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
          </div>

          <p>
            By creating an account you agree to our{" "}
            <a href="/" style={{ color: "dodgerblue" }} className="terms">
              Terms & Privacy
            </a>
            .
          </p>

          <div className="clearfix">
            <button type="button" onClick={signUp}>
              Sign Up
            </button>
            <p>
              Already have an account?{" "}
              <Link to="/">
                {" "}
                <button type="button">Login</button>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
