import { Handlers } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import { AddQuoteUseCase } from "../../application/useCases/addQuote.ts";
import { myContainer } from "../../dependancyInjection/container.ts";
import { TYPES } from "../../dependancyInjection/tokens.ts";
import ImageTextDetector from "../../islands/ImageTextDetector.tsx";

export const SECRET = "blaisepascal";

export const handler: Handlers = {
  async GET(_req, ctx) {
    return await ctx.render();
  },
  async POST(req, _ctx) {
    const form = await req.formData();
    const author = form.get("author")?.toString() || "";
    const content = form.get("content")?.toString() || "";
    const source = form.get("source")?.toString() || "";
    const tags = form.get("tags")?.toString().split(",") || [];
    const quote = {
      author,
      content,
      source,
      tags,
    };

    const result = await myContainer.get<AddQuoteUseCase>(TYPES.AddQuoteUseCase)
      .execute({
        quote,
      });
    const headers = new Headers();

    if (result) {
      headers.set(
        "location",
        `/quotes/read?id=${result.id}`,
      );
      return new Response(null, {
        status: 303,
        headers,
      });
    }
    throw new Error("Oupsi, something went wrong");
  },
};

export default function AddQuote() {
  const contentSignal = useSignal<string>("");

  const handleTextDetected = (text: string) => {
    contentSignal.value = text;
  };

  return (
    <div class="flex items-center justify-center min-h-screen ">
      <div class="w-full max-w-lg p-8 bg-white rounded-lg shadow-md ">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Add a Quote</h2>
        <ImageTextDetector onTextDetected={handleTextDetected} />
        <form class="flex flex-wrap flex-col gap-4" method="POST">
          <div>
            <label
              for="content"
              class="block text-sm font-medium text-gray-700"
            >
              Quote
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter the quote"
              value={contentSignal.value}
            />
          </div>

          <div>
            <label for="author" class="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Enter the author's name"
            />
          </div>

          <div>
            <label for="source" class="block text-sm font-medium text-gray-700">
              Source
            </label>
            <input
              type="text"
              id="source"
              name="source"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Enter the source (e.g., book title, page number)"
            />
          </div>

          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Tags separated by semicolons (e.g., philosophy;wisdom)"
            />
          </div>

          <button
            type="submit"
            class="mt-4 text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full"
          >
            Save Quote
          </button>
        </form>
      </div>
    </div>
  );
}
