import { Handlers, PageProps } from "$fresh/server.ts";
import { ListQuotesUseCase } from "../../application/useCases/listQuotes.ts";
import { myContainer } from "../../dependancyInjection/container.ts";
import { TYPES } from "../../dependancyInjection/tokens.ts";
import { QuoteEntity } from "../../domain/entities/quotes.ts";

type PageData = { quotes: Array<QuoteEntity> };

export const handler: Handlers = {
  async GET(_req, ctx) {
    const result = await myContainer.get<ListQuotesUseCase>(
      TYPES.ListQuotesUseCase,
    ).execute();

    if (result) {
      return ctx.render({ quotes: result.quotes });
    }
    return new Response("No quote found", {
      status: 404,
    });
  },
};

export default function ReadQuote({ data }: PageProps<PageData>) {
  const { quotes } = data;

  return quotes.map((q) => ({
    content: q.getContent(),
    author: q.getAuthor(),
    tags: q.getTags(),
    source: q.getSource(),
  }))
    .map(({
      content,
      author,
      tags,
      source,
    }) => (
      <>
        <section>
          <blockquote class="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
            <p class="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white">
              "{content}"
            </p>
          </blockquote>
          <p>{author || "–"}{source ? <cite>, {source}</cite> : ""}</p>
          {tags?.map((tag) => (
            <>
              <pre class="bg-gray-200 text-gray-800 px-2 py-1 rounded inline-block font-mono text-sm mr-2">{tag.trim()}</pre>
              <br />
            </>
          ))}
        </section>
        <hr class="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
      </>
    ));
}
