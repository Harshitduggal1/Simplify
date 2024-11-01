import { Icons, SignInForm } from "@/components";
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image

const SignInPage = () => {
    return (
        <div className="flex flex-col items-start max-w-sm mx-auto h-dvh overflow-hidden pt-4 md:pt-20 backdrop-blur-lg">
            <div className="flex items-center w-full py-8 border-b border-border/80 backdrop-filter backdrop-blur-xl">
                <Link href="/#home" className="flex items-center gap-x-2 group hover:scale-105 transition-all duration-300 ease-in-out">
                    <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
                    <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        Simplify.AI
                    </h1>
                </Link>
            </div>

            <SignInForm />

            <div className="flex flex-col items-start w-full backdrop-blur-md p-4 rounded-xl">
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-700 hover:from-gray-200 hover:to-gray-600 transition-all duration-300">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 transition-all duration-300 font-extrabold hover:underline decoration-wavy decoration-purple-500">
                        Terms of Service{" "}
                    </Link>
                    and{" "}
                    <Link href="/privacy" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 transition-all duration-300 font-extrabold hover:underline decoration-wavy decoration-purple-500">
                        Privacy Policy
                    </Link>
                </p>
            </div>
            <div className="flex items-start mt-auto border-t border-border/80 py-6 w-full backdrop-blur-md">
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-700">
                    Don&apos;t have an account?{" "}
                    <Link 
                        href="/auth/sign-up" 
                        className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-extrabold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 group"
                    >
                        <span className="relative z-10">Sign up</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300 rounded-lg"></span>
                    </Link>
                </p>
            </div>
        </div>
    )
};

export default SignInPage