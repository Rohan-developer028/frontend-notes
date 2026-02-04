import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/ReactToastify.css"
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOff, LockKeyhole, Mail, MailIcon, User } from "lucide-react";


function Form() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [login, setLogin] = useState({ email: "", password: "" })
  const [loginForm, setLoginForm] = useState(true)
  const [err, setErr] = useState({})
  const [passshow, setPassshow] = useState(false)
  
  const nav = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleChange1 = (e) =>
    setLogin({ ...login, [e.target.name]: e.target.value });

  const url = process.env.REACT_APP_API_URL;
  const handleSubmit2 = async (e) => {
    console.log(process.env.REACT_APP_API_URL)
    e.preventDefault();
    console.log(form);
    if (Object.keys(validate()).length == 0) {
      try {
        const res = await fetch(`${url}/api/v1/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: "user"
          })
        })
        const data = await res.json()
        console.log(data.status)
        if (data.status) {
          toast.success(data?.message || "Rgisterd Successfully")
          setLoginForm(true)
          setForm({ name: "", email: "", password: "" })

        }
        else {
          toast.error(data?.message || "Something went wrong")
        }
      }
      catch (err) {
        console.log(err)
      }
    }
  };
  const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    var err = {}
    if (!form.name.trim())
      err.name = "Name is required"
    if (!form.password.trim())
      err.password = "Password is required"
    else if (form.password.length < 8)
      err.password = "Password must be graer than 8 character"
    if (!form?.email.trim()) {
      err.email = "eamil is required"
    }
    else if (!emailCheck.test(form.email)) {
      err.email = "Enter a valid email"
    }
    setErr(err)

    console.log(err)
    return err
  }

  const validate2 = () => {
    var err = {}

    if (!login.password.trim())
      err.password = "Password is required"
    else if (login.password.length < 8)
      err.password = "Password must be graer than 8 character"
    if (!login?.email.trim()) {
      err.email = "eamil is required"
    }
    else if (!emailCheck.test(login.email)) {
      err.email = "Enter a valid email"
    }
    setErr(err)

    console.log(err)
    return err
  }
  const handleLogin = async (e) => {
    e.preventDefault()
    if (Object.keys(validate2()).length == 0) {
      try {
        const res = await fetch(`${url}/api/v1/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: login.email,
            password: login.password,
          })
        })
        const data = await res.json()
        console.log(data)
        if (data.status) {
          toast.success(data?.message || "Rgisterd Successfully")
          // setLoginForm(true)
          setLogin({ name: "", email: "", password: "" })
          if (data.user.role == "admin") {
            localStorage.setItem("admin-token", JSON.stringify(data.token))
            nav("/admin")
          }
          else
            localStorage.setItem("token", JSON.stringify(data.token))
          localStorage.setItem("user", JSON.stringify(data.user))
          nav("/")

        }
        else {
          toast.error(data.message || "Something went wrong")
        }
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  const changeForm = () => {
    setErr({})
    setLogin({ email: "", password: "" })
    setForm({ email: "", password: "", name: "" })
    setLoginForm(!loginForm)
    setPassshow(false)
  }


  return (
    <div className="min-h-screen  flex items-center justify-center bg-white px-4 py-auto ">
      <div className="w-[22rem] border rounded-2xl bg-[#ebe9e9ff] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-lg">

        <h1 className="mb-4 text-center text-3xl font-bold tracking-wide text-black">
          {loginForm ? "Login" : "Register"}
        </h1>

        {loginForm ? (
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-2">
              <div className="flex items-center border border-black rounded-lg px-3 py-2">
                <Mail className="text-black mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={login.email}
                  onChange={handleChange1}
                  className="w-full bg-transparent outline-none text-black placeholder-black"
                />
              </div>
              {err.email && (
                <p className="text-red-500 text-sm mt-1">{err.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <div className="flex items-center border border-black rounded-lg px-3 py-2">
                <LockKeyhole className="text-black mr-2" />
                <input
                  type={passshow ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={login.password}
                  onChange={handleChange1}
                  className="w-full bg-transparent outline-none text-black placeholder-black"
                />
                {
                  passshow ? <EyeIcon onClick={() => setPassshow(!passshow)} /> : <EyeOff onClick={() => setPassshow(!passshow)} />
                }
              </div>
              {err.password && (
                <p className="text-red-500 text-sm mt-1">{err.password}</p>
              )}
            </div>

            {/* Switch */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={changeForm}
                className="text-black text-sm font-medium hover:underline"
              >
                Don't have an account? Register
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-black py-3 font-bold text-white hover:opacity-90"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit2}>
            {/* Name */}
            <div className="mb-2">
              <div className="flex items-center border border-black rounded-lg px-3 py-2">
                <User className="text-black mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-black placeholder-black"
                />
              </div>
              {err.name && (
                <p className="text-red-500 text-sm mt-1">{err.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-2">
              <div className="flex items-center border border-black rounded-lg px-3 py-2">
                <MailIcon className="text-black mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-black placeholder-black"
                />
              </div>
              {err.email && (
                <p className="text-red-500 text-sm mt-1">{err.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <div className="flex items-center border border-black rounded-lg px-3 py-2">
                <LockKeyhole className="text-black mr-2" />
                <input
                  type={passshow ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-black placeholder-black"
                />
                {
                  passshow ? <EyeIcon onClick={() => setPassshow(!passshow)} /> : <EyeOff onClick={() => setPassshow(!passshow)} />
                }
              </div>
              {err.password && (
                <p className="text-red-500 text-sm mt-1">{err.password}</p>
              )}
            </div>

            {/* Switch */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={changeForm}
                className="text-black text-sm font-medium hover:underline"
              >
                Already registered? Login
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800"
            >
              Create Account
            </button>
          </form>
        )}

       
      </div>
       <ToastContainer />
    </div>
  );

}

export default Form;
