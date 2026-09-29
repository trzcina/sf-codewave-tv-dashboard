import { draftMode } from "next/headers";
import Image from "next/image";
import { flotiqApiClient, isFlotiqConfigured } from "@/lib/flotiq-api-client";

/**
 * Starter page: proves the SDK connection by listing the newest images from the
 * built-in Media library (`_media`), which exists in every Flotiq space.
 * Replace it with your own content types after running `npm run typegen`.
 */
export default async function Home() {
  const { isEnabled: isDraft } = await draftMode();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Next.js + Flotiq
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Flotiq Next.js starter</h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Content comes from Flotiq through <code>@flotiq/flotiq-api-sdk</code>, cached by
          Next.js and invalidated by a Flotiq webhook. Deployed to Vercel from GitHub Actions.
        </p>
        {isDraft ? (
          <p className="text-sm text-amber-600">Draft mode: showing unpublished content.</p>
        ) : null}
      </header>

      {isFlotiqConfigured ? <MediaGrid /> : <SetupNotice />}
    </main>
  );
}

async function MediaGrid() {
  let media;
  try {
    media = await flotiqApiClient.content._media.list({
      limit: 6,
      orderBy: "internal.createdAt",
      orderDirection: "desc",
      filters: { type: { type: "equals", filter: "image" } },
    });
  } catch (error) {
    console.error("Flotiq request failed", error);
    return (
      <section className="rounded-lg border border-red-300 p-6 text-red-700 dark:border-red-800 dark:text-red-400">
        Could not reach Flotiq. Check that <code>FLOTIQ_API_KEY</code> is valid.
      </section>
    );
  }

  if (!media.data.length) {
    return (
      <section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        Connected to Flotiq. Upload an image to the Media library to see it here.
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Latest media ({media.total_count})</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {media.data.map((item) => (
          <li key={item.id} className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <Image
              src={flotiqApiClient.helpers.getMediaUrl(item, { width: 400, height: 300 })}
              alt={item.alt || item.title || ""}
              width={400}
              height={300}
              className="aspect-[4/3] w-full object-cover"
            />
            <p className="truncate px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
              {item.title || item.fileName}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SetupNotice() {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-xl font-semibold">Connect your Flotiq space</h2>
      <ol className="list-decimal space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
        <li>
          Copy <code>.env.example</code> to <code>.env.local</code> and set{" "}
          <code>FLOTIQ_API_KEY</code> and <code>FLOTIQ_CLIENT_AUTH_KEY</code>.
        </li>
        <li>
          Run <code>npm run typegen</code> to generate <code>flotiq-api.d.ts</code> for your
          content types.
        </li>
        <li>Restart the dev server.</li>
      </ol>
    </section>
  );
}
