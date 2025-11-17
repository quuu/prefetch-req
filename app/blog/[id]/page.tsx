import { unstable_cache } from "next/cache";

// Enable ISR with lazy generation
export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

// Return empty array to enable lazy ISR (pages generated on first request)
export function generateStaticParams() {
  return [];
}

// Simulate slow data fetching with unstable_cache
async function getBlogPost(id: string) {
  const startTime = Date.now();
  console.log(
    `[${new Date().toISOString()}] Starting to fetch blog post: ${id}`
  );

  // Artificial 10-second delay
  await new Promise((resolve) => setTimeout(resolve, 10000));

  const endTime = Date.now();
  const generationTime = (endTime - startTime) / 1000;

  console.log(
    `[${new Date().toISOString()}] Finished fetching blog post: ${id} (${generationTime}s)`
  );

  return {
    id,
    title: `Blog Post: ${id}`,
    content: `This is a blog post with unstable_cache enabled. It took ${generationTime} seconds to generate.`,
    generatedAt: new Date().toISOString(),
    generationTime,
    requestId: Math.random().toString(36).substring(7),
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getBlogPost(id);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col items-center gap-8 p-16 max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            {post.content}
          </p>
        </div>

        <div className="w-full border-t border-zinc-200 dark:border-zinc-700 pt-6 space-y-4">
          <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <span className="font-semibold text-blue-900 dark:text-blue-300">
              Generated At:
            </span>
            <span className="font-mono text-sm text-blue-700 dark:text-blue-400">
              {post.generatedAt}
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
            <span className="font-semibold text-green-900 dark:text-green-300">
              Generation Time:
            </span>
            <span className="font-mono text-sm text-green-700 dark:text-green-400">
              {post.generationTime.toFixed(2)}s
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
            <span className="font-semibold text-purple-900 dark:text-purple-300">
              Request ID:
            </span>
            <span className="font-mono text-sm text-purple-700 dark:text-purple-400">
              {post.requestId}
            </span>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded">
            <p className="text-sm text-amber-900 dark:text-amber-300">
              <strong>Cache Config:</strong> ISR with lazy generation +
              unstable_cache (1 hour revalidation)
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-700 dark:text-slate-400">
              <strong>ISR Mode:</strong> force-static with dynamicParams=true
              and empty generateStaticParams() for lazy generation
            </p>
          </div>
        </div>

        <a
          href="/"
          className="mt-4 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        >
          Back to Home
        </a>
      </main>
    </div>
  );
}
