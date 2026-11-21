"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "../lib/auth-client";
import { useAuth } from "../components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp.email({
          name,
          email,
          password,
        });
        if (error) {
          setErrorMsg(error.message || "Sign up failed.");
          return;
        }
      } else {
        const { error } = await signIn.email({
          email,
          password,
        });
        if (error) {
          setErrorMsg(error.message || "Invalid email or password.");
          return;
        }
      }

      await refreshSession();
      router.push("/");
      router.refresh();
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setErrorMsg("Google login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">BookNook</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isSignUp ? "Create a new account" : "Sign in to your account"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition cursor-pointer"
          >
            {loading
              ? "Please wait..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-white text-gray-800 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition cursor-pointer"
        >
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg("");
            }}
            className="font-semibold text-gray-900 underline cursor-pointer"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}