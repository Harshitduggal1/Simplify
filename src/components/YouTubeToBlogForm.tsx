"use client"
import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardIcon, CheckIcon, EyeIcon, HeartIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import Confetti from 'react-confetti';
import { Toaster, toast } from 'react-hot-toast';
import { YouTubeMetadata } from '@/types/youtube';
import { fetchYouTubeMetadata } from '@/utils/youtube';

interface BlogPostResponse {
  blogPost: string;
  error?: string;
}

const YouTubeToBlogForm = (): JSX.Element => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [blogPost, setBlogPost] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const formatBlogContent = (content: string): ReactNode[] => {
    return content.split('\n\n').map((block, index) => {
      // Heading detection
      if (block.startsWith('#')) {
        const level = block.match(/^#+/)?.[0].length || 1;
        const text = block.replace(/^#+\s/, '');
        
        const headingClasses = {
          1: "text-6xl font-black mb-12 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent animate-gradient tracking-tight leading-tight drop-shadow-lg hover:scale-[1.02] transform transition-all duration-500 cursor-default p-4 rounded-2xl backdrop-blur-xl border-b-4 border-purple-500/20 hover:border-purple-500/40",
          2: "text-5xl font-extrabold mt-16 mb-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight leading-tight hover:scale-[1.02] transform transition-all duration-500 p-3 rounded-xl backdrop-blur-lg shadow-xl hover:shadow-2xl",
          3: "text-4xl font-bold mt-12 mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent tracking-tight leading-tight hover:scale-[1.02] transform transition-all duration-500 p-2 rounded-lg backdrop-blur-md"
        }[level] || "text-3xl font-semibold mt-8 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent p-2";

        return (
          <motion.h1 
            key={`heading-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${headingClasses} hover:translate-y-[-2px] hover:shadow-purple-500/20`}
          >
            {text}
          </motion.h1>
        );
      }

      // List detection
      if (block.match(/^[-*]\s/)) {
        return (
          <ul key={`list-${index}`} className="space-y-4 my-8 list-none backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/90 rounded-3xl p-8 shadow-2xl border border-purple-100/50 hover:border-purple-200/50 transition-all duration-500 hover:shadow-purple-500/20 hover:scale-[1.01]">
            {block.split('\n').map((item, i) => (
              <motion.li
                key={`list-item-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="
                  relative pl-10 text-gray-800 hover:text-gray-900
                  before:content-[''] before:absolute before:left-0 before:top-[0.6rem]
                  before:w-4 before:h-4 before:bg-gradient-to-br from-purple-500 to-indigo-500
                  before:rounded-full before:shadow-xl before:transform
                  before:transition-all before:duration-500
                  hover:before:scale-150 hover:before:rotate-[360deg]
                  hover:translate-x-3 transition-all duration-500
                  text-xl font-medium tracking-wide leading-relaxed
                  backdrop-blur-xl hover:backdrop-blur-2xl
                  hover:bg-white/40 rounded-2xl p-4
                  border border-transparent hover:border-purple-100/50
                  shadow-lg hover:shadow-xl
                "
              >
                {item.replace(/^[-*]\s/, '')}
              </motion.li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <motion.p
          key={`paragraph-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="
            text-gray-800 text-xl leading-loose my-8
            hover:text-blue-500 transition-colors duration-500
            first-letter:text-6xl first-letter:font-black
            first-letter:text-transparent first-letter:bg-clip-text
            first-letter:bg-gradient-to-br first-letter:from-blue-600 first-letter:to-pink-600
            first-letter:mr-3 first-letter:float-left first-letter:leading-none
            tracking-wide font-medium backdrop-blur-xl
            hover:backdrop-blur-2xl p-6 rounded-2xl
            hover:bg-white/50
            border border-purple-100/30 hover:border-purple-200/50
            shadow-xl hover:shadow-2xl hover:-translate-y-1
            selection:bg-purple-200 selection:text-purple-900
            hover:scale-[1.01] transform
          "
        >
          {block}
        </motion.p>
      );
    });
  };

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setBlogPost(null);
    setMetadata(null);

    try {
      const response = await fetch('/api/generateBlogPost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate blog post');
      }

      setBlogPost(data.blogPost);
      setMetadata(data.metadata);
      toast.success('Blog post generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    if (blogPost) {
      try {
        await navigator.clipboard.writeText(blogPost);
        setCopied(true);
        setShowConfetti(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => {
          setCopied(false);
          setShowConfetti(false);
        }, 3000);
      } catch (error) {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100/50 hover:shadow-purple-500/20 transition-all duration-500"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="videoUrl" 
              className="block text-lg font-semibold text-gray-700 mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            >
              YouTube Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
              className="w-full px-6 py-3 rounded-xl border border-gray-200
                       focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500
                       transition-all duration-300 text-lg shadow-inner
                       bg-white/50 backdrop-blur-sm hover:bg-white/80 text-gray-800"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-4 px-6 rounded-xl
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
              }
              text-white font-bold text-lg
              transition-all duration-300
              shadow-xl hover:shadow-2xl hover:shadow-purple-500/30
              flex items-center justify-center space-x-3
              border border-white/10 backdrop-blur-sm
            `}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent
                             rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Blog Post</span>
            )}
          </motion.button>
        </form>

        {isLoading && (
          <div className="mt-8">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500
                         transition-all duration-500 ease-out animate-pulse"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-base text-gray-600 mt-3 text-center font-medium">
              {progress}% complete
            </p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 font-medium shadow-xl"
          >
            {error}
          </motion.div>
        )}

        {blogPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="
              bg-white/90 backdrop-blur-2xl
              rounded-3xl shadow-2xl
              hover:shadow-purple-500/20
              transition-all duration-500
              overflow-hidden border border-gray-100/50
              hover:scale-[1.01] transform
            "
          >
            <div className="
              flex justify-between items-center
              px-10 py-8 border-b border-gray-100/50
              bg-gradient-to-r from-violet-50/80 via-white/80 to-indigo-50/80
              backdrop-blur-xl
            ">
              <h2 className="
                text-4xl font-black
                bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600
                bg-clip-text text-transparent
                animate-gradient tracking-tight
                hover:scale-[1.02] transform transition-all duration-300
              ">
                Generated Blog Post
              </h2>
              <div className="relative">
                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center space-x-3 px-6 py-3 rounded-xl
                    transition-all duration-300 shadow-xl
                    ${copied 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600'
                    }
                    font-bold text-lg border border-white/20 backdrop-blur-sm
                    hover:shadow-2xl hover:shadow-purple-500/20
                  `}
                >
                  {copied ? (
                    <CheckIcon className="h-6 w-6 text-white" />
                  ) : (
                    <ClipboardIcon className="h-6 w-6 text-white" />
                  )}
                  <span className="text-white">
                    {copied ? 'Copied!' : 'Copy to clipboard'}
                  </span>
                </motion.button>
                {showConfetti && (
                  <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                    colors={['#8B5CF6', '#6366F1', '#4F46E5', '#7C3AED']}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      zIndex: 1000,
                    }}
                  />
                )}
              </div>
            </div>
            
            {metadata && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-[400px] overflow-hidden">
                  <img 
                    src={metadata.thumbnail}
                    alt={metadata.title}
                    className="w-full h-full object-cover rounded-t-none rounded-b-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  
                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
                        {metadata.title}
                      </h1>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <EyeIcon className="h-5 w-5 text-white/90" />
                          <span className="text-white/90 font-medium">{metadata.views} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <HeartIcon className="h-5 w-5 text-white/90" />
                          <span className="text-white/90 font-medium">{metadata.likes} likes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-white/90" />
                          <span className="text-white/90 font-medium">{metadata.publishedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-5 w-5 text-white/90" />
                        <span className="text-white/90 font-medium">{metadata.channelTitle}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <article className="
              prose prose-2xl max-w-none px-12 py-10
              bg-gradient-to-b from-white/95 to-gray-50/95
              rounded-3xl shadow-2xl border border-purple-100/50
              backdrop-blur-2xl hover:shadow-purple-500/30
              transition-all duration-500 hover:scale-[1.005]
              prose-headings:font-black prose-headings:tracking-tight
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-xl
              prose-a:text-purple-600 prose-a:font-semibold prose-a:no-underline
              hover:prose-a:text-purple-500 hover:prose-a:underline
              prose-strong:text-purple-700 prose-strong:font-extrabold
              prose-code:text-purple-600 prose-code:bg-purple-50/80
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-ol:list-decimal prose-ul:list-disc
              prose-li:text-lg prose-li:leading-relaxed
              selection:bg-purple-100 selection:text-purple-900
              hover:prose-headings:text-purple-900
              prose-img:rounded-2xl prose-img:shadow-xl
              space-y-8
            ">
              {formatBlogContent(blogPost)}
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YouTubeToBlogForm;