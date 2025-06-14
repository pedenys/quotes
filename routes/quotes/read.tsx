import { Handlers, PageProps } from "$fresh/server.ts";
import { ReadQuoteUseCase } from "../../application/useCases/readQuote.ts";
import { myContainer } from "../../dependancyInjection/container.ts";
import { TYPES } from "../../dependancyInjection/tokens.ts";

type PageData = {
  author: string;
  tags: Array<string>;
  content: string;
  source: string;
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || "";
    if (!id) {
      return new Response("Quote not found", {
        status: 404,
      });
    }

    const result = await myContainer.get<ReadQuoteUseCase>(
      TYPES.ReadQuoteUseCase,
    ).execute({ identifier: id });

    if (result) {
      const q = result.quote;

      return ctx.render({
        author: q.getAuthor(),
        tags: q.getTags(),
        source: q.getSource(),
        content: q.getContent(),
      });
    }

    return new Response("Hum quote was found but something went wrong 🦆", {
      status: 500,
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
      {tags.map((tag) => (
        <>
          <pre class="bg-gray-200 text-gray-800 px-2 py-1 rounded inline-block font-mono text-sm mr-2">{tag.trim()}</pre>
          <br />
        </>
      ))}
    </section>
  );
}
