import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>quotes</title>
        <link rel="stylesheet" href="/styles.css" />
        {/* Add Tesseract.js for OCR functionality */}
        <script src="https://cdn.jsdelivr.net/npm/tesseract.js@2.1.5/dist/tesseract.min.js">
        </script>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
