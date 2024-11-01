import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image
import { AnimationContainer } from "@/components"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
 
const Footer = () => {
    return (
        <footer className="flex flex-col relative items-center justify-center border-t border-border/10 pt-16 pb-8 md:pb-0 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-32 bg-gradient-to-b from-background/80 to-background">

            <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full blur-[1px]"></div>

            <div className="grid gap-12 xl:grid-cols-3 xl:gap-16 w-full">

                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-start justify-start md:max-w-[240px]">
                        <div className="flex items-start">
                            <Image src="/icons/logo.png" alt="Logo" width={32} height={32} /> {/* Use Image component for logo */}
                        </div>
                        <p className="text-muted-foreground mt-4 text-sm text-start">
                            Transform your content with AI-powered simplicity.
                        </p>
                        <div className="mt-4 text-neutral-200 text-4xl flex flex flex-col items-center justify-center pr-8">
                            Crafted by <Link href="https://shreyas-sihasane.vercel.app/" className="  pr-4 font-medium ml-1 bg-clip-text text-4xl text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 hover:text-primary transition-colors">Simplify.AI</Link>
                        </div>
                    </div>
                </AnimationContainer>

                <div className="grid-cols-2 gap-12 grid mt-16 xl:col-span-2 xl:mt-0">
                    <div className="md:grid md:grid-cols-2 md:gap-12">
                        <AnimationContainer delay={0.2}>
                            <div className="">
                                <h3 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                    Platform
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground space-y-3">
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            AI Features
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            Pricing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            Success Stories
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            API Access
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                        <AnimationContainer delay={0.3}>
                            <div className="mt-10 md:mt-0 flex flex-col">
                                <h3 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                    Connect
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground space-y-3">
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            Discord
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            GitHub
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            Twitter
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            LinkedIn
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-12">
                        <AnimationContainer delay={0.4}>
                            <div className="">
                                <h3 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                    Resources
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground space-y-3">
                                    <li>
                                        <Link href="/resources/blog" className="hover:text-primary/90 transition-colors duration-200">
                                            AI Blog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/resources/help" className="hover:text-primary/90 transition-colors duration-200">
                                            Documentation
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                        <AnimationContainer delay={0.5}>
                            <div className="mt-10 md:mt-0 flex flex-col">
                                <h3 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                    Legal
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground space-y-3">
                                    <li>
                                        <Link href="" className="hover:text-primary/90 transition-colors duration-200">
                                            About Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy" className="hover:text-primary/90 transition-colors duration-200">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className="hover:text-primary/90 transition-colors duration-200">
                                            Terms of Service
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                    </div>
                </div>

            </div>
            <div className="mt-12 border-t border-border/10 pt-8 md:flex md:items-center md:justify-between w-full">
                <AnimationContainer delay={0.6}>
                    <p className="text-white text-2xl ">
                        &copy; {new Date().getFullYear()} Simplify.ai. All rights reserved!
                    </p>
                </AnimationContainer>
            </div>
            <BackgroundBeamsWithCollision className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-4xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white dark:text-white font-sans tracking-tight">
              Simplify.AI{" "}
            </div>
            <div className="text-4xl flex justify-center text-center relative md:text-4xl lg:text-7xl font-bold  w-max bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 py-4 [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <span>JSON Made Easy.</span>
            </div>
          </BackgroundBeamsWithCollision>
        </footer>
    )
}

export default Footer
