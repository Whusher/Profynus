import { useState } from "react"
import { motion, useAnimateMini } from "framer-motion"
import { Eye, EyeOff, Check, AlertCircle, Lock, User, Mail, UserCircle } from "lucide-react"


import ProfynusWolf from "@assets/icons/logo-square.png"
import Logo from "@/components/layout/Logo"

// Toast manager
import { sileo } from "sileo"



import { Link } from "react-router"
import { useNavigate } from "react-router"

export default function SignUp() {
    const navigation = useNavigate();
    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    // Validation state
    const [errors, setErrors] = useState({
        firstName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    // UI state
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [formValid, setFormValid] = useState(false)

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }

        // Calculate password strength when password changes
        if (name === "password") {
            calculatePasswordStrength(value)
        }
    }

    // Calculate password strength
    const calculatePasswordStrength = (password) => {
        let strength = 0

        if (password.length >= 8) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1

        setPasswordStrength(strength)
    }

    // Get strength label and color
    const getStrengthLabel = () => {
        if (passwordStrength === 0) return { label: "Very Weak", color: "bg-red-500" }
        if (passwordStrength === 1) return { label: "Weak", color: "bg-orange-500" }
        if (passwordStrength === 2) return { label: "Medium", color: "bg-yellow-500" }
        if (passwordStrength === 3) return { label: "Strong", color: "bg-green-500" }
        if (passwordStrength === 4) return { label: "Very Strong", color: "bg-emerald-500" }
    }

    // Validate form
    const validateForm = () => {
        let isValid = true
        const newErrors = { ...errors }

        // Validate first name
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required"
            isValid = false
        }

        // Validate username
        if (!formData.username.trim()) {
            newErrors.username = "Username is required"
            isValid = false
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters"
            isValid = false
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
            isValid = false
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email"
            isValid = false
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = "Password is required"
            isValid = false
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
            isValid = false
        }

        // Validate confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
            isValid = false
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormSubmitted(true)

        const isValid = validateForm()
        if (isValid) {

            setFormValid(true);
            
            

        } else {
            setFormValid(false)
        }
    }

    return (
        <div className="flex w-full min-h-screen bg-gradient-to-l from-black via-black via-35% to-cyan-900">
            {/* Left side with image */}
            <div className="relative hidden md:flex md:basis-1/2 flex-col justify-center items-center bg-blend-color-dodge">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10 p-4 mt-2 mx-auto bg-gradient-to-b from-60% from-black to-cyan-700 shadow-2xl shadow-cyan-500 animate-[shake-shadow_8s_infinite_ease-in]"
                >
                    <img src={ProfynusWolf || "/placeholder.svg"} alt="Profynus logo" className="w-[20rem]" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full flex space-x-5 justify-center items-center p-5 text-white"
                >
                    <span style={{ fontFamily: 'Audiowide, sans-serif' }} className="bg-black bg-clip-text text-transparent w-full sm:w-1/2 text-center font-bold text-2xl md:text-3xl tracking-wider mb-4 sm:mb-0">
                        PROFYNUS
                    </span>
                    <p className="w-1/2 text-center text-sm sm:text-base md:text-lg font-light leading-relaxed text-white">
                        The application for your{" "}
                        <span className="font-semibold tracking-[0.18em] text-cyan-400 uppercase">ears</span>,{" "}
                        <span className="font-semibold tracking-[0.18em] text-cyan-400 uppercase">essence</span>, and{" "}
                        <span className="font-semibold tracking-[0.18em] text-cyan-400 uppercase">style</span>.
                    </p>
                </motion.div>
            </div>

            {/* Right side with form */}
            <div className="flex basis-full md:basis-1/2 text-white justify-center items-center py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col justify-evenly items-center w-full max-w-md py-5 my-4 rounded-2xl bg-transparent border-2 border-gray-400 text-black relative overflow-hidden"
                >

                    {/* Form header */}
                    <div className="flex flex-col md:flex-row justify-between items-center my-2 w-full px-6">
                        <div className="text-center md:text-left">
                            <motion.div
                                style={{ fontFamily: 'Audiowide, sans-serif' }}
                                className="text-white text-3xl font-audiowide font-bold flex items-center max-w-md"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                >

                                {/* Circle logo for small devices */}
                                <span className="md:hidden mx-3">
                                    <Logo size={72} />
                                </span>
                                Sign Up
                            </motion.div>
                            <motion.p
                                className="text-sm mt-1.5 text-gray-300"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Join Profynus to discover and create amazing music playlists.
                            </motion.p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col w-full p-4 text-white items-center gap-4">
                        <div className="w-full max-w-sm space-y-5">
                            {/* First Name Field */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`border pl-10 pr-3 py-2 rounded-md h-11 w-full bg-black/30 text-white focus:outline-none focus:ring-2 transition-all ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-cyan-400 focus:ring-cyan-500"}`}
                                        placeholder="John"
                                    />
                                </div>
                                {errors.firstName && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-xs text-red-500 flex items-center"
                                    >
                                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.firstName}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Username Field */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label htmlFor="username" className="block mb-2 text-sm font-medium">
                                    Username / Alias
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <UserCircle className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`border pl-10 pr-3 py-2 rounded-md h-11 w-full bg-black/30 text-white focus:outline-none focus:ring-2 transition-all ${errors.username ? "border-red-500 focus:ring-red-500" : "border-cyan-400 focus:ring-cyan-500"}`}
                                        placeholder="musiclover123"
                                    />
                                </div>
                                {errors.username && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-xs text-red-500 flex items-center"
                                    >
                                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.username}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Email Field */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`border pl-10 pr-3 py-2 rounded-md h-11 w-full bg-black/30 text-white focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-500 focus:ring-red-500" : "border-cyan-400 focus:ring-cyan-500"}`}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-xs text-red-500 flex items-center"
                                    >
                                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.email}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Password Field */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`border pl-10 pr-10 py-2 rounded-md h-11 w-full bg-black/30 text-white focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-500 focus:ring-red-500" : "border-cyan-400 focus:ring-cyan-500"}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-cyan-400"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-xs text-red-500 flex items-center"
                                    >
                                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.password}
                                    </motion.p>
                                )}

                                {/* Password strength indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs text-gray-400">Password strength:</span>
                                            <span className="text-xs font-medium text-cyan-400">{getStrengthLabel().label}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                                            <motion.div
                                                className={`h-1.5 rounded-full ${getStrengthLabel().color}`}
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                                                transition={{ duration: 0.5 }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Confirm Password Field */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`border pl-10 pr-10 py-2 rounded-md h-11 w-full bg-black/30 text-white focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-cyan-400 focus:ring-cyan-500"}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-cyan-400"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-xs text-red-500 flex items-center"
                                    >
                                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.confirmPassword}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Login link */}
                            <motion.div
                                className="text-center mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <p className="text-gray-300">
                                    Already have an account?{" "}
                                    <Link
                                        to={'/login'}
                                        className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </motion.div>

                            {/* Submit button */}
                            <motion.div
                                className="w-full text-center mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <motion.button
                                    type="submit"
                                    className="py-2.5 px-5 w-full rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-bold shadow-lg shadow-cyan-900/30 transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Create Account
                                </motion.button>
                            </motion.div>
                        </div>
                    </form>

                    {/* Success message */}
                    {formValid && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/90 z-10"
                        >
                            <div className="bg-gradient-to-b from-black to-cyan-950/50 p-8 rounded-xl border border-cyan-500/30 text-center max-w-xs">
                                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="h-8 w-8 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Registration Successful!</h3>
                                <p className="text-gray-300 mb-6">Your account has been created. Welcome to Profynus!</p>
                                <button
                                    onClick={() => navigation('/validate-account')}
                                    className="bg-cyan-500 text-black px-6 py-2 rounded-md font-medium hover:bg-cyan-400 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
