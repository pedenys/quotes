import { Handlers, PageProps } from "$fresh/server.ts";
import { QuoteEntity } from "../../domain/entities/quotes.ts";

type PageData = { quotes: any };

export const handler: Handlers = {
  async GET(_req, ctx) {
    // refactor me
    const kv = await Deno.openKv();
    const iter = kv.list<string>({ prefix: ["quote"] });
    const result = [];
    for await (const res of iter) result.push(res);
    console.log({ "🙂": result });

    if (result) {
      return ctx.render({ quotes: result });
    }
    return new Response("No quote found", {
      status: 404,
    });
  },
};

export default function ReadQuote({ data }: PageProps<PageData>) {
  const { quotes } = data;
  console.log({ data, quotes });

  return quotes.map((q) => q.value).map(({ content, author, tags, source }) => (
    <>
      <section>
        <blockquote class="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
          <p class="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white">
            "{content}"
          </p>
        </blockquote>
        <p>{author || "–"}{source ? <cite>, {source}</cite> : ""}</p>
        {tags?.split(",").map((tag) => (
          <pre class="bg-gray-200 text-gray-800 px-2 py-1 rounded inline-block font-mono text-sm mr-2">{tag}</pre>
        ))}
      </section>
      <hr class="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
    </>
  ));
}
