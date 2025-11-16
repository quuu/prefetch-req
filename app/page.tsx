import Link from 'next/link';

// Force dynamic rendering so randomId changes on each page load
export const dynamic = 'force-dynamic';

// Generate a random UUID-like string with two random segments
function generateRandomId() {
  const segment1 = Math.random().toString(36).substring(2, 15);
  const segment2 = Math.random().toString(36).substring(2, 15);
  return `${segment1}-${segment2}`;
}

export default function Home() {
  const randomId = generateRandomId();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black py-16 px-8">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            ISR Prefetch Deduplication Test
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Test how Next.js handles request deduplication when a page with <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded text-sm">unstable_cache</code> is prefetched and navigated to while still loading.
          </p>
        </div>

        <div className="w-full max-w-2xl p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            Get Started
          </h2>

          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-left">
              <p className="text-sm text-blue-900 dark:text-blue-300 mb-3">
                Navigate to a test page with any ID:
              </p>
              <code className="block bg-blue-100 dark:bg-blue-900/40 px-4 py-2 rounded text-sm font-mono text-blue-700 dark:text-blue-400">
                /{'{your-blog-id}'}
              </code>
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-400 text-left space-y-2">
              <p><strong>Example:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">/test-123</code></li>
                <li><code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">/my-blog-post</code></li>
                <li><code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">/any-id-you-want</code></li>
              </ul>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <Link
                href={`/${randomId}`}
                className="inline-block px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full text-lg font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors shadow-lg"
              >
                Start Test with Random ID
              </Link>
              <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-500 space-y-1">
                <p className="font-semibold">Will navigate to:</p>
                <p className="font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded">/{randomId}</p>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-2">
                  <p>Test 1 will use: <span className="font-mono">{randomId.split('-')[0]}</span></p>
                  <p>Test 2 will use: <span className="font-mono">{randomId.split('-')[1]}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-left">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            How it works:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>Navigate to <code className="bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">/{'{id}'}</code> to see the test page</li>
            <li>The page shows two prefetch tests (hover and auto)</li>
            <li>Both tests link to <code className="bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">/blog/{'{id}'}</code> which uses <code className="bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">unstable_cache</code> with a 10s delay</li>
            <li>Click during the prefetch to test if Next.js reuses the ongoing request</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
