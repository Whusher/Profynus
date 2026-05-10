/**
 * @file Login.jsx
 * @description 
 * Login view for Profynus Web application 
 * supporting 0Auth and MFA authentication methods
 * 
 * 0Auth providers:
 * - Github
 * - Google
 */


// Dependencies and Components
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react"
import { useNavigate } from "react-router"
import { Link } from "react-router"
import { sileo } from "sileo"
import useAuthStore from "@/store/auth/AuthStore"
import useUserStore from "@/store/user/UserStore"

// Media Assets
import ProfynusWolf from "@assets/icons/logo-square.png"
import MusicParticles from "@/components/layout/MusicParticles"
import Logo from "@/components/layout/Logo"
import authService from "@/api/services/authService"

export default function LoginPage() {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [loginError, setLoginError] = useState("")
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }

        // Clear login error when user modifies inputs
        if (loginError) {
            setLoginError("")
        }
    }

    // Validate form
    const validateForm = () => {
        let isValid = true
        const newErrors = { ...errors }

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
        }

        setErrors(newErrors)
        return isValid
    }

    // Handle form submission
    const handleSubmit = async (e) => {

        e.preventDefault()
        setFormSubmitted(true)

        const isValid = validateForm();

        if (isValid) {
            setIsLoading(true)
            try {

                // Call API for login request 
                // Depending on the issuer of the Auth request everything 
                // most be handled include default for now.
                const response = await authService.login(formData);
                console.log(response);

                if (response.success){
                    localStorage.setItem("access_token", response.accessToken)
                    const profile = await useUserStore.getState().fetchProfile()
                    // // Mirror into auth store user object for convenience
                    if (profile) {
                        useAuthStore.getState().setUser({
                            userId: profile.userId || profile.id || null,
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            username: profile.username,
                            email: profile.email,
                            accountCreationDate: profile.accountCreationDate,
                        })
                    }
                    navigate('/home');
                }
                else{
                    sileo.error({
                        title: "Login Failed",
                        description: "Please check your credentials and try again.",
                    });
                    return;
                }
            } catch (error) {
                console.log(error);
                sileo.error({
                    description: error.userMessage ?? "Please try again.",
                    position: 'top-center'
                });
                // setLoginError("An error occurred. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }
    }

    // Check form validity on data change
    useEffect(() => {
        if (formSubmitted) {
            validateForm();
        }
    }, [isLoading, formSubmitted])

    return (
        <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden scrollbar-hide">
            {/* Left side - Login Form */}
            <div
                id="left-side"
                className="flex w-full h-screen scrollbar-hide md:basis-1/2 bg-linear-to-l from-black via-black via-35% to-cyan-900 text-white py-8 md:py-0 overflow-y-auto"
            >

                <motion.div
                    id="form-target"
                    className="flex flex-col justify-evenly items-center mx-auto md:mx-10 lg:mx-20 py-5 my-auto rounded-2xl 
                    w-[90%] md:w-full bg-transparent border-2 border-gray-400 text-black relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >

                    {/* Circle logo for small devices */}
                    <div className="md:hidden">
                        <Logo size={92}/>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
                        <p className="text-white text-2xl text-center mt-1" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                            PROFYNUS <span className="block text-sm font-light">Music app</span>
                        </p>
                    </motion.div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex-col flex w-full space-y-5 md:space-y-7 justify-center items-center text-white mt-4"
                    >
                        {/* Login error message */}
                        <AnimatePresence>
                            {loginError && (
                                <motion.div
                                    className="w-[85%] sm:w-3/4 bg-red-500/20 border border-red-500/50 rounded-md p-3 flex items-center"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                                    <p className="text-red-200 text-sm">{loginError}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email field */}
                        <motion.div
                            className="w-[85%] sm:w-3/4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <label htmlFor="email" className="block mb-2">
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
                                    className={`border pl-10 pr-3 py-2 rounded-md h-11 w-full bg-black/40 text-white focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-500 focus:ring-red-500" : "border-cyan-400 focus:ring-cyan-500"
                                        }`}
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

                        {/* Password field */}
                        <motion.div
                            className="w-[85%] sm:w-3/4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <label htmlFor="password" className="block mb-2">
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
                                    className={`border pl-10 pr-10 py-2 rounded-md h-11 w-full bg-black/40 text-white focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-500 focus:ring-red-500" : "border-cyan-400 focus:ring-cyan-500"
                                        }`}
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
                        </motion.div>

                        {/* Remember me checkbox */}
                        <motion.div
                            className="w-[85%] sm:w-3/4 flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 text-cyan-500 bg-black border-cyan-400 rounded focus:ring-cyan-500 focus:ring-2"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                                Remember me
                            </label>
                        </motion.div>

                        {/* Links */}
                        <motion.div
                            className="w-[85%] sm:w-3/4 text-center space-y-5 md:space-y-6 mt-2 md:mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <p className="text-sm sm:text-base">
                                Don't have an account?{" "}
                                <Link
                                    to={"/signup"}
                                    className="text-cyan-400 underline font-semibold hover:cursor-pointer hover:text-cyan-300 transition-colors"
                                >
                                    Register now
                                </Link>
                            </p>
                            <motion.p

                                className="text-sm sm:text-base text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link to={'/forgot-password'}>
                                    Forgot password?
                                </Link>
                            </motion.p>
                        </motion.div>

                        {/* Login button */}
                        <motion.div
                            id="buttons-group"
                            className="w-full text-center mb-4 md:mb-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="py-2.5 px-5 w-40 rounded-lg bg-linear-to-r from-cyan-600 to-cyan-500 
                         hover:from-cyan-500 hover:to-cyan-400 text-black font-bold shadow-lg 
                         shadow-cyan-900/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Logging in...
                                    </span>
                                ) : (
                                    "Login"
                                )}
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>

            {/* Right side - Image and Promotion */}
            <div
                id="right-side"
                className="relative hidden md:flex w-full md:basis-1/2 flex-col justify-center items-center bg-blend-color-dodge bg-black py-10 md:py-0 md:h-full"
            >
                <div
                    aria-hidden="true"
                    className="absolute top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/12 blur-3xl"
                />
                <motion.div
                    id="image-container"
                    className="relative z-10 p-4 mt-2 mx-auto rounded-4xl border border-cyan-400/20 bg-linear-to-b from-60% from-black to-cyan-700 
                    animate-[shake-shadow_8s_infinite_ease-in]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        boxShadow: "0 28px 70px rgba(8, 145, 178, 0.24), 0 16px 38px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                    }}
                >
                    <img
                        src={ProfynusWolf || "/placeholder.svg"}
                        alt="business logotype"
                        className="w-60 sm:w-72 md:w-80 drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)]"
                    />
                </motion.div>

                <motion.div
                    id="promotion-lader"
                    className="w-full flex flex-col sm:flex-row sm:space-x-5 justify-center items-center p-5 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <span style={{ fontFamily: 'Audiowide, sans-serif' }} className="bg-linear-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent w-full sm:w-1/2 text-center font-bold text-2xl md:text-3xl tracking-wider mb-4 sm:mb-0">
                        PROFYNUS
                    </span>

                    {/* Separator line for desktop */}
                    <div id="separator-line-virtual" className="hidden sm:block w-px mr-10 h-25" />

                    {/* Animated separator */}
                    <div
                        id="separator-line"
                                                className="w-4 rounded-3xl absolute h-50 md:h-100 bottom-2 blur-md center bg-linear-to-b 
                                            from-cyan-400/80 via-cyan-600 z-0 to-cyan-950/30"
                                                style={{
                                                        boxShadow: "0 0 28px rgba(34, 211, 238, 0.3), 0 0 90px rgba(8, 145, 178, 0.16)",
                                                }}
                    />
                    {/* Promotion phrase */}
                        <p className="w-full sm:w-1/2 px-4 sm:px-0 text-center text-sm sm:text-base md:text-lg font-light leading-relaxed text-cyan-50/85">
                            The application for your{" "}
                            <span className="font-semibold tracking-[0.18em] text-cyan-200 uppercase">ears</span>,{" "}
                            <span className="font-semibold tracking-[0.18em] text-cyan-300 uppercase">essence</span>, and{" "}
                            <span className="font-semibold tracking-[0.18em] text-cyan-200 uppercase">style</span>.
                    </p>
                </motion.div>


                {/* Music notes animation */}
                <MusicParticles
                    particlesPreference={8}
                />

            </div>
        </div>
    )
}

