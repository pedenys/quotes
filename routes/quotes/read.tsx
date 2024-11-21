import { Handlers, PageProps } from "$fresh/server.ts";
import { Quote } from "../../types/quote.ts";

type PageData = Quote;

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || "";

    const kv = await Deno.openKv();
    const result = await kv.get<
      Quote
    >(["quote", id]);

    if (result.value) {
      const { author, tags, source, content } = result.value;

      return ctx.render({ author, tags, source, content });
    }
    return new Response("Quote not found", {
      status: 404,
    });
  },
};

export default function ReadQuote({ data }: PageProps<PageData>) {
  const { author, content, source, tags } = data;
  return (
    <section>
      <blockquote class="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
        <p class="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white">
          "{content}"
        </p>
      </blockquote>
      <p>{author || "–"}{source ? <cite>, {source}</cite> : ""}</p>
      <p>{tags}</p>
    </section>
  );
}
