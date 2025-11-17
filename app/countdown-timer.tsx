"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";

interface CountdownTimerProps {
  blogId: string;
}

export default function CountdownTimer({ blogId }: CountdownTimerProps) {
  const router = useRouter();

  // Split the blogId into two segments for independent tests
  const [blogId1, blogId2] = blogId.includes("-")
    ? blogId.split("-")
    : [blogId, blogId];

  // Manual prefetch (hover) test
  const [prefetchStartTime, setPrefetchStartTime] = useState<number | null>(
    null
  );
  const [clickTime, setClickTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isPrefetching, setIsPrefetching] = useState(false);

  // Auto prefetch (page load) test
  const [autoStartTime, setAutoStartTime] = useState<number | null>(null);
  const [autoClickTime, setAutoClickTime] = useState<number | null>(null);
  const [autoElapsedTime, setAutoElapsedTime] = useState<number>(0);

  // Start auto prefetch timer on mount
  useEffect(() => {
    setAutoStartTime(Date.now());
    console.log("Auto prefetch started at", new Date().toISOString());
  }, []);

  // Manual prefetch timer
  useEffect(() => {
    if (prefetchStartTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - prefetchStartTime) / 1000;
        setElapsedTime(elapsed);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [prefetchStartTime]);

  // Auto prefetch timer
  useEffect(() => {
    if (autoStartTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - autoStartTime) / 1000;
        setAutoElapsedTime(elapsed);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [autoStartTime]);

  const handleMouseEnter = () => {
    if (!isPrefetching && blogId1) {
      setPrefetchStartTime(Date.now());
      setIsPrefetching(true);
      console.log("Manual prefetch triggered at", new Date().toISOString());
      console.log("Prefetching blog ID (Test 1):", blogId1);
      // Explicitly trigger prefetch
      router.prefetch(`/blog/${blogId1}`);
    }
  };

  const handleClick = () => {
    if (prefetchStartTime) {
      const clickElapsed = (Date.now() - prefetchStartTime) / 1000;
      setClickTime(clickElapsed);
      console.log(
        `Manual link clicked after ${clickElapsed.toFixed(
          2
        )}s of prefetch start`
      );
    }
  };

  const handleAutoClick = () => {
    if (autoStartTime) {
      const clickElapsed = (Date.now() - autoStartTime) / 1000;
      setAutoClickTime(clickElapsed);
      console.log(
        `Auto link clicked after ${clickElapsed.toFixed(2)}s of page load`
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          ISR Prefetch + Request Deduplication Tests
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Test how Next.js handles request deduplication when a page is
          prefetched and then navigated to while the prefetch is still in
          progress.
        </p>
        {(blogId1 || blogId2) && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Blog Post IDs:
            </p>
            <div className="space-y-2 text-xs font-mono text-blue-700 dark:text-blue-400">
              <div className="flex items-center justify-between gap-2">
                <span className="text-blue-600 dark:text-blue-500 font-semibold">
                  Test 1 (Hover):
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1.5 rounded">
                  {blogId1}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-purple-600 dark:text-purple-500 font-semibold">
                  Test 2 (Auto):
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/40 px-3 py-1.5 rounded">
                  {blogId2}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test 1: Manual Prefetch (router.prefetch on hover) */}
      <div className="w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Test 1: Manual Prefetch (Hover)
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Hover to trigger{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
              router.prefetch()
            </code>
          </p>
        </div>

        {/* Fixed height container to prevent layout shift */}
        <div className="min-h-[200px] flex items-center justify-center">
          {isPrefetching && (
            <div className="flex flex-col items-center gap-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 min-w-[400px]">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {elapsedTime.toFixed(1)}s
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Time since prefetch started
                </div>
              </div>

              <div className="flex gap-2 items-center">
                {elapsedTime < 10 ? (
                  <>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                      Prefetch in progress...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                      Prefetch complete!
                    </span>
                  </>
                )}
              </div>

              {elapsedTime >= 8 && elapsedTime < 10 && (
                <div className="text-sm text-purple-700 dark:text-purple-400 font-medium animate-pulse">
                  👆 Click now to test request reuse!
                </div>
              )}

              {clickTime !== null && (
                <div className="text-sm text-green-700 dark:text-green-400 font-medium">
                  Clicked at {clickTime.toFixed(2)}s - Navigating...
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href={`/blog/${blogId1}`}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            prefetch={false}
            className="px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full text-lg font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors shadow-lg disabled:opacity-50"
          >
            Go to Blog Post
          </Link>
        </div>

        <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-700 dark:text-zinc-300 text-center">
          <strong>Instructions:</strong> Hover to start countdown, click at ~9s
          to test deduplication
        </div>
      </div>

      {/* Test 2: Automatic Prefetch (prefetch={true} on page load) */}
      <div className="w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Test 2: Automatic Prefetch (Page Load)
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Link with{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
              prefetch={`{true}`}
            </code>{" "}
            - starts on mount
          </p>
        </div>

        {/* Fixed height container to prevent layout shift */}
        <div className="min-h-[200px] flex items-center justify-center mb-8">
          <div className="flex flex-col items-center gap-4 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 min-w-[400px]">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {autoElapsedTime.toFixed(1)}s
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Time since page load (auto prefetch)
              </div>
            </div>

            <div className="flex gap-2 items-center">
              {autoElapsedTime < 10 ? (
                <>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                    Auto prefetch in progress...
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                    Auto prefetch complete!
                  </span>
                </>
              )}
            </div>

            {autoElapsedTime >= 8 && autoElapsedTime < 10 && (
              <div className="text-sm text-purple-700 dark:text-purple-400 font-medium animate-pulse">
                👇 Click now to test request reuse!
              </div>
            )}

            {autoClickTime !== null && (
              <div className="text-sm text-green-700 dark:text-green-400 font-medium">
                Clicked at {autoClickTime.toFixed(2)}s - Navigating...
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href={`/blog/${blogId2}`}
            onClick={handleAutoClick}
            prefetch={true}
            className="px-8 py-4 bg-purple-600 dark:bg-purple-500 text-white rounded-full text-lg font-medium hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors shadow-lg disabled:opacity-50"
          >
            Go to Blog Post
          </Link>
        </div>

        <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-700 dark:text-zinc-300 text-center">
          <strong>Instructions:</strong> Wait ~9s from page load, then click to
          test deduplication
        </div>
      </div>

      {/* General Instructions */}
      <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg max-w-3xl space-y-3">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Expected Behavior:
        </h3>
        <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <p>
            <strong>✅ If deduplication works:</strong> Page loads at ~10s total
            (1 network request)
          </p>
          <p>
            <strong>❌ If it doesn't work:</strong> Page loads at ~19s total (2
            network requests)
          </p>
          <p className="mt-4">
            Open DevTools Network tab to see the requests. Check the Request ID
            on the blog pages to verify if the same request was reused.
          </p>
          <p className="mt-4">
            <strong>Blog IDs:</strong> Test 1 uses first segment ({blogId1}),
            Test 2 uses second segment ({blogId2}) from the URL path (/{blogId}
            ).
          </p>
        </div>
      </div>
    </div>
  );
}
