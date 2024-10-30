export default function QuoteForm() {
  const saveQuote = async (event: Event) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const content = (form.elements.namedItem("content") as HTMLInputElement)
      .value;
    const author = (form.elements.namedItem("author") as HTMLInputElement)
      .value;
    const source = (form.elements.namedItem("source") as HTMLInputElement)
      .value;
    const tagsInput = (form.elements.namedItem("tags") as HTMLInputElement)
      .value;
    const tags = tagsInput.split(";");

    const supabaseUrl = "https://your-project-id.supabase.co";
    const supabaseApiKey = "YOUR_PUBLIC_API_KEY";

    const response = await fetch(`${supabaseUrl}/rest/v1/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: supabaseApiKey,
        Authorization: `Bearer ${supabaseApiKey}`,
      },
      body: JSON.stringify([{ content, author, source, tag: tags }]),
    });

    if (!response.ok) {
      console.error("Failed to save quote:", await response.text());
    } else {
      console.log("Quote saved successfully:", await response.json());
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Add a Quote</h2>
        <form onSubmit={saveQuote} class="space-y-5">
          <div>
            <label
              for="content"
              class="block text-sm font-medium text-gray-700"
            >
              Quote
            </label>
            <textarea
              id="content"
              rows={4}
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the quote"
              required
            />
          </div>

          <div>
            <label for="author" class="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              id="author"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the author's name"
              required
            />
          </div>

          <div>
            <label for="source" class="block text-sm font-medium text-gray-700">
              Source
            </label>
            <input
              type="text"
              id="source"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the source (e.g., book title, page number)"
              required
            />
          </div>

          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tags separated by semicolons (e.g., philosophy;wisdom)"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Quote
          </button>
        </form>
      </div>
    </div>
  );
}
