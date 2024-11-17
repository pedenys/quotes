import { Handlers, PageProps } from "$fresh/server.ts";

type PageData = {
  author: string;
  tags: string;
  source: string;
  content: string;
};

export const handler: Handlers = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const author = url.searchParams.get("author") || "";
    const tags = url.searchParams.get("tags") || "";
    const source = url.searchParams.get("source") || "";
    const content = url.searchParams.get("content") || "";

    return ctx.render({ author, tags, source, content });
  },
};

export default function ReadQuote({ data }: PageProps<PageData>) {
  const { author, content, source, tags } = data;
  return (
    <section>
      <p>{author}</p>
      <p>{content}</p>
      <p>{source}</p>
      <p>{tags}</p>
    </section>
  );
}
