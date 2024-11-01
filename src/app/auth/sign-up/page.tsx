import { SignUpForm } from "@/components";
import Link from "next/link";
import Image from 'next/image';

const SignUpPage = () => {
    return (
        <div className="flex flex-col items-start max-w-sm mx-auto h-dvh overflow-hidden pt-4 md:pt-20 backdrop-blur-lg">
            <div className="flex items-center w-full py-8 border-b border-border/80 backdrop-filter backdrop-blur-xl">
                <Link href="/#home" className="flex items-center gap-x-2 group hover:scale-105 transition-all duration-300 ease-in-out">
                    <Image src="/icons/logo.png" alt="Logo" width={24} height={24}  />
                    <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">
                        Simplify.AI
                    </h1>
                </Link>
            </div>

            <SignUpForm />

            <div className="flex flex-col items-start w-full backdrop-blur-md p-4 rounded-xl">
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600 transition-all duration-300">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 transition-all duration-300 font-extrabold hover:underline decoration-wavy decoration-purple-600">
                        Terms of Service{" "}
                    </Link>
                    and{" "}
                    <Link href="/privacy" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 transition-all duration-300 font-extrabold hover:underline decoration-wavy decoration-purple-600">
                        Privacy Policy
                    </Link>
                </p>
            </div>
            <div className="flex items-start mt-auto border-t border-border/80 py-6 w-full backdrop-blur-md">
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">
                    Already have an account?{" "}
                    <Link 
                        href="/auth/sign-in" 
                        className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700 font-extrabold hover:from-purple-800 hover:to-pink-800 transition-all duration-300 group"
                    >
                        <span className="relative z-10">Sign in</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300 rounded-lg"></span>
                    </Link>
                </p>
            </div>
        </div>
    )
};

export default SignUpPage