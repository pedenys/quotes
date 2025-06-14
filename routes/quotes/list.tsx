import { Handlers, PageProps } from "$fresh/server.ts";
import { ListQuotesUseCase } from "../../application/useCases/listQuotes.ts";
import { myContainer } from "../../dependancyInjection/container.ts";
import { TYPES } from "../../dependancyInjection/tokens.ts";
import { QuoteEntity } from "../../domain/entities/quotes.ts";

type PageData = Array<QuoteEntity>;

export const handler: Handlers = {
  async GET(_req, ctx) {
    const result = await myContainer.get<ListQuotesUseCase>(
      TYPES.ListQuotesUseCase,
    )
      .execute({});

    if (result) {
      return ctx.render({ quotes: result });
    }
    return new Response("Could not retreive list of quotes", {
      status: 500,
    });
  },
};

export default function ListQuotes({ data }: PageProps<PageData>) {
  return data.map(({ _content, _author, _id, _source, _tags }) => (
    <section>
      <blockquote class="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
        <p class="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white">
          "{_content}"
        </p>
      </blockquote>
      <p>{_author || "–"}{_source ? <cite>, {_source}</cite> : ""}</p>
      {_tags?.map((tag) => (
        <>
          <pre class="bg-gray-200 text-gray-800 px-2 py-1 rounded inline-block font-mono text-sm mr-2">{tag.trim()}</pre>
          <br />
        </>
      ))}
    </section>
  ));
}
