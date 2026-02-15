import { QuoteEntity } from "../domain/entities/quotes.ts";

interface ExportButtonProps {
  quotes: Array<QuoteEntity>;
}

export default function ExportButton({ quotes }: ExportButtonProps) {
  const handleExportJSON = () => {
    // Convert quotes to a clean JSON format
    const quotesForExport = quotes.map((quote) => ({
      id: quote._id,
      content: quote._content,
      author: quote._author,
      source: quote._source,
      tags: quote._tags,
    }));

    // Create a blob with the JSON data
    const jsonString = JSON.stringify(quotesForExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quotes-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExportJSON}
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-200"
    >
      Export as JSON
    </button>
  );
}
