import CountdownTimer from '../countdown-timer';

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black py-16 px-8">
      <main className="flex w-full max-w-4xl flex-col items-center gap-12">
        <CountdownTimer blogId={id} />
      </main>
    </div>
  );
}
