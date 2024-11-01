import { AnimationContainer, MaxWidthWrapper, PricingCards } from "@/components";
import { BentoCard, BentoGrid, CARDS } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LampContainer } from "@/components/ui/lamp";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import Meteors from "@/components/ui/meteors";
import SparklesText from "@/components/ui/sparkles-text";
import { COMPANIES, PROCESS } from "@/utils";
import { REVIEWS } from "@/utils/constants/misc";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRightIcon, CreditCardIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = async () => {

    const user = await currentUser();

    return (
        <div className="overflow-x-hidden scrollbar-hide size-full ">
            {/* Hero Section */}
            <MaxWidthWrapper>
            <Meteors number={30} />
                <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-black relative">
                    <SparklesText className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent " text="Magic UI" />
                    <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
                        <button className="group relative grid overflow-hidden rounded-full px-8 py-3 shadow-[0_0_25px_rgba(139,92,246,0.3)] bg-gradient-to-r from-violet-600/30 to-indigo-600/30 backdrop-blur-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-500 border border-violet-500/20">
                            <span className="z-10 py-0.5 text-sm text-neutral-50 flex items-center justify-center gap-2 font-medium tracking-wider">
                                🚀 The Future of AI Data Processing is Here
                                <ArrowRightIcon className="ml-1 size-4 transition-transform duration-500 ease-out group-hover:translate-x-2" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 animate-pulse"></div>
                        </button>
                        <h1 className="text-center py-10 text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl !leading-[0.9] w-full font-heading bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 animate-gradient-x [text-shadow:0_0_80px_rgba(139,92,246,0.5)]">
                            Transform Data <br/>
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-gradient-y [text-shadow:0_0_80px_rgba(59,130,246,0.5)]">
                                With AI Magic
                            </span>
                          
                        </h1>
                       
                        <p className="mb-14 text-xl tracking-tight text-neutral-300 md:text-2xl max-w-3xl mx-auto font-light">
                            #1 AI-Powered JSON Converter & Content Generator
                            <br className="hidden md:block" />
                            <span className="hidden md:block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent font-medium">Transform Any Data Format. Generate Elite Content. Scale Effortlessly.</span>
                        </p>
                        <div className="flex items-center justify-center whitespace-nowrap gap-8 z-50">
                            <Button asChild className="px-10 py-7 text-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-indigo-500 border-none shadow-xl hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-500 rounded-2xl">
                                <Link href={user ? "/dashboard" : "/auth/sign-in"} className="flex items-center gap-3">
                                    Launch AI Dashboard
                                    <ArrowRightIcon className="w-6 h-6" />
                                </Link>
                            </Button>
                        </div>
                    </AnimationContainer>
                    <AnimationContainer delay={0.2} className="relative pt-28 pb-24 md:py-40 px-2 bg-transparent w-full">
                        <div className="absolute top-1/4 left-1/2 w-full -translate-x-1/2 h-1/2 bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-indigo-500/50 blur-[10rem] animate-pulse"></div>
                        <div className="-m-2 rounded-[2.5rem] p-6 ring-2 ring-inset ring-white/30 lg:-m-4 lg:rounded-[3rem] bg-black/60 backdrop-blur-3xl hover:ring-violet-500/50 transition-all duration-700 group hover:scale-[1.05] hover:shadow-2xl hover:shadow-violet-500/50">
                            <BorderBeam
                                size={500}
                                duration={5} 
                                delay={3}
                            />
                            <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] bg-gradient-to-br from-black/90 via-black/80 to-black/90">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-700/30 via-fuchsia-700/30 to-indigo-700/30 animate-gradient-xy"></div>
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255,255,255,0.2)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,black,transparent)]"></div>
                                <Image
                                    src="/assets/dashboard-dark.svg"
                                    alt="Simplify.AI Dashboard"
                                    width={1400}
                                    height={1400}
                                    quality={100}
                                    className="relative z-10 transition-all duration-700 group-hover:scale-[1.05] group-hover:rotate-1 group-hover:brightness-125 shadow-lg shadow-violet-500/50"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>
                            <div className="absolute -bottom-6 inset-x-0 w-full h-1/2 bg-gradient-to-t from-black via-black/90 to-transparent z-40"></div>
                            <div className="absolute bottom-0 md:-bottom-10 inset-x-0 w-full h-1/3 bg-gradient-to-t from-black via-black/95 to-transparent z-50"></div>
                        </div>
                    </AnimationContainer>
                    </div>
            </MaxWidthWrapper>
            {/* Companies Section */}
            <MaxWidthWrapper>
                <AnimationContainer delay={0.4}>
                    <div className="py-14 relative">
                        <div className="absolute inset-0 "></div>
                        <div className="mx-auto px-4 md:px-8 relative">
                            <h2 className="text-center text-6xl font-bold font-heading bg-gradient-to-r from-purple-600 via-blue-600 to-black bg-clip-text text-transparent animate-gradient-x uppercase tracking-wider">
                                Trusted by the best in the industry
                            </h2>
                            <div className="mt-8">
                                <ul className="flex flex-wrap items-center gap-x-6 gap-y-6 md:gap-x-16 justify-center [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                                    {COMPANIES.map((company) => (
                                        <li key={company.name} className="transform transition-all duration-500 hover:scale-110 hover:brightness-125">
                                            <Image
                                                src={company.logo}
                                                alt={company.name}
                                                width={80}
                                                height={80}
                                                quality={100}
                                                className="w-28 h-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </AnimationContainer>
            </MaxWidthWrapper>

            {/* Features Section */}
            <MaxWidthWrapper className="pt-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col w-full items-center lg:items-center justify-center py-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-cyan-600/10 blur-3xl"></div>
                        <MagicBadge title="Features" />
                        <h2 className="text-center lg:text-center text-7xl md:text-7xl !leading-[1.1] font-medium font-heading bg-gradient-to-r from-gray-950/30 via-pink-700 to-blue-700 bg-clip-text text-transparent animate-gradient-x mt-6">
                            Manage Links Like a Pro
                        </h2>
                        <p className="mt-4 text-center font-bold lg:text-center text-3xl bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent max-w-lg backdrop-blur-3xl">
                            Simplify.AI is a powerful link management tool that helps you shorten, track, and organize all your links in one place.
                        </p>
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.2}>
                    <BentoGrid className="py-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-fuchsia-600/5 to-cyan-600/5 animate-pulse blur-2xl"></div>
                        {CARDS.map((feature, idx) => (
                            <BentoCard key={idx} {...feature} className="backdrop-blur-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500" />
                        ))}
                    </BentoGrid>
                </AnimationContainer>
            </MaxWidthWrapper>
            {/* Process Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="The Process" />
                        <h2 className="text-center lg:text-center text-5xl font-extrabold text-transparent mt-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text animate-gradient-x">
                            Simplify.AI<br/>
                            The Ultimate AI Data Converter
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Manage links in 3 simple steps. Optimize, organize, and share with ease!
                        </p>
                        </div>
                </AnimationContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4 md:gap-8">
                    {PROCESS.map((process, id) => (
                        <AnimationContainer delay={0.2 * id} key={id}>
                            <MagicCard className="group md:py-8 backdrop-blur-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500">
                                <div className="flex flex-col items-start justify-center w-full">
                                    <process.icon strokeWidth={1.5} className="w-10 h-10 text-foreground" />
                                    <div className="flex flex-col relative items-start">
                                        <span className="absolute -top-6 right-0 border-2 border-border text-foreground font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center pt-0.5">
                                            {id + 1}
                                        </span>
                                        <h3 className="text-base mt-6 font-medium text-foreground">
                                            {process.title.replace(/linkify/g, 'simplify.AI')}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {process.description}
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                        </AnimationContainer>
                    ))}
                </div>
            </MaxWidthWrapper>
            {/* Pricing Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Simple Pricing" />
                        <h2 className="text-center lg:text-center text-5xl md:text-7xl !leading-[1.1] font-extrabold font-heading  mt-6 bg-gradient-to-r from-black via-purple-700 to-blue-700 bg-clip-text  text-transparent animate-gradient-x">
                            Choose a plan that works for you
                        </h2>
                        <p className="mt-4 text-center lg:text-center  text-xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-300/30 max-w-lg">
                            Get started with simplify.AI today and enjoy more features with our pro plans.
                        </p>
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.2}>
                    <PricingCards />
                </AnimationContainer>
                <AnimationContainer delay={0.3}>
                    <div className="flex flex-wrap items-start md:items-center justify-center lg:justify-evenly gap-6 mt-12 max-w-5xl mx-auto w-full">
                        <div className="flex items-center gap-2">
                            <CreditCardIcon className="w-10 h-10 text-green-600" />
                            <span className="text-muted-foreground text-white text-5xl font-bold">
                                No credit card required
                            </span>
                        </div>
                    </div>
                </AnimationContainer>
            </MaxWidthWrapper>
            {/* Reviews Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Our Customers" />
                        <h2 className="text-center lg:text-center text-5xl md:text-7xl !leading-[1.1] font-medium font-heading mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                            What our users are saying
                        </h2>
                        <h3 className="text-6xl">
                        🤔
                        </h3>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Here&apos;s what some of our users have to say about simplify.AI.
                        </p>
                    </div>
                </AnimationContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 md:gap-8 py-10">
                    <div className="flex flex-col items-start h-min gap-6">
                        {REVIEWS.slice(0, 3).map((review, index) => (
                            <AnimationContainer delay={0.2 * index} key={index}>
                                <MagicCard key={index} className="md:p-0">
                                    <Card className="flex flex-col w-full border-none h-min bg-gradient-to-r from-gray-300 to-white shadow-lg rounded-lg">
                                        <CardHeader className="space-y-0">
                                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                                {review.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {review.username}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pb-4">
                                            <p className="text-muted-foreground">
                                                {review.review}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="w-full space-x-1 mt-auto">
                                            {Array.from({ length: review.rating }, (_, i) => (
                                                <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </CardFooter>
                                    </Card>
                                </MagicCard>
                            </AnimationContainer>
                        ))}
                    </div>
                    <div className="flex flex-col items-start h-min gap-6">
                        {REVIEWS.slice(3, 6).map((review, index) => (
                            <AnimationContainer delay={0.2 * index} key={index}>
                                <MagicCard key={index} className="md:p-0">
                                <Card className="flex flex-col w-full border-none h-min bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 shadow-lg rounded-lg">
                                        <CardHeader className="space-y-0">
                                            <CardTitle className="text-lg font-medium  text-white ">
                                                {review.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {review.username}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pb-4">
                                            <p className="text-muted-foreground text-white ">
                                                {review.review}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="w-full space-x-1 mt-auto">
                                            {Array.from({ length: review.rating }, (_, i) => (
                                                <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </CardFooter>
                                    </Card>
                                </MagicCard>
                            </AnimationContainer>
                        ))}
                    </div>
                    <div className="flex flex-col items-start h-min gap-6">
                        {REVIEWS.slice(6, 9).map((review, index) => (
                            <AnimationContainer delay={0.2 * index} key={index}>
                                <MagicCard key={index} className="md:p-0">
                                <Card className="flex flex-col w-full border-none h-min bg-gradient-to-r from-gray-300 to-white shadow-lg rounded-lg">
                                        <CardHeader className="space-y-0">
                                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                                {review.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {review.username}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pb-4">
                                            <p className="text-muted-foreground">
                                                {review.review}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="w-full space-x-1 mt-auto">
                                            {Array.from({ length: review.rating }, (_, i) => (
                                                <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </CardFooter>
                                    </Card>
                                </MagicCard>
                            </AnimationContainer>
                        ))}
                    </div>
                </div>
            </MaxWidthWrapper>
            {/* CTA Section */}
            <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
                <AnimationContainer delay={0.1}>
                    <LampContainer>
                        <div className="flex flex-col items-center justify-center relative w-full text-center">
                            <h2 className="text-4xl flex justify-center text-center relative md:text-4xl lg:text-7xl font-bold  w-max bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 py-4 mt-8 [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                                Simplify your data  <br/>
                             with the most advanced AI
                            </h2>
                            <p className="text-white mt-6 max-w-md mx-auto">
                                Discover the leading solution for converting data to JSON and generating top-notch content effortlessly.
                            </p>
                            <div className="mt-6">
                            <SparklesText  text=" Exciting times ahead!" />
                                <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-pink-600 text-white  text-xl font-semibold py-3 px-3 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
                                    Get started for free
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </LampContainer>
                </AnimationContainer>
            </MaxWidthWrapper>
            </div>
        )
    };
    
    export default HomePage
