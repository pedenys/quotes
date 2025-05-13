import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

// Define a type for Tesseract.js
interface TesseractWorker {
  load: () => Promise<void>;
  loadLanguage: (lang: string) => Promise<void>;
  initialize: (lang: string) => Promise<void>;
  recognize: (image: File | string) => Promise<{
    data: {
      text: string;
    };
  }>;
  terminate: () => Promise<void>;
}

interface TesseractLogger {
  progress?: number;
  status?: string;
  jobId?: string;
  workerId?: string;
  [key: string]: unknown;
}

interface TesseractResult {
  data: {
    text: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface TesseractStatic {
  createWorker: (
    options?: { logger?: (log: TesseractLogger) => void },
  ) => TesseractWorker;

  recognize: (
    image: string | File | HTMLImageElement,
    lang: string,
    options?: { logger?: (log: TesseractLogger) => void },
  ) => Promise<TesseractResult>;
}

// Add type declaration for the global Tesseract object
declare global {
  interface Window {
    Tesseract: TesseractStatic;
  }
}

// Reference to the Tesseract.js library
let Tesseract: TesseractStatic | null = null;

interface ImageTextDetectorProps {
  onTextDetected?: (text: string) => void;
}

export default function ImageTextDetector(
  { onTextDetected }: ImageTextDetectorProps,
) {
  const detectedText = useSignal<string>("");
  const isProcessing = useSignal<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tesseractLoaded = useSignal<boolean>(false);
  const imagePreview = useSignal<string | null>(null);
  const errorMessage = useSignal<string | null>(null);

  // Check if Tesseract.js is available
  useEffect(() => {
    if (IS_BROWSER) {
      // Wait a moment to ensure the script has loaded
      setTimeout(() => {
        try {
          // Access Tesseract from the window object
          if ((window as Window).Tesseract) {
            Tesseract = (window as Window).Tesseract;
            tesseractLoaded.value = true;
            console.log("Tesseract.js is available");
          } else {
            console.error("Tesseract.js not found in window object");
            errorMessage.value =
              "Text recognition library not found. Please refresh the page.";
          }
        } catch (error) {
          console.error("Error accessing Tesseract.js:", error);
          errorMessage.value = "Failed to access text recognition library.";
        }
      }, 1000);
    }
  }, []);

  const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Reset states
    detectedText.value = "";
    errorMessage.value = null;
    isProcessing.value = true;

    // Create image preview
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Process image with Tesseract.js
      if (tesseractLoaded.value) {
        await processImage(file);
      } else {
        errorMessage.value =
          "Text recognition library is not loaded yet. Please try again in a moment.";
        isProcessing.value = false;
      }
    } catch (error) {
      console.error("Error processing image:", error);
      errorMessage.value =
        "Error processing image. Please try a different image.";
      isProcessing.value = false;
    }
  };

  // Function to preprocess the image for better OCR results
  const preprocessImage = (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(imageUrl); // If canvas not supported, return original
          return;
        }

        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply image processing for better OCR
        // 1. Convert to grayscale and increase contrast
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

          // Increase contrast - make dark pixels darker and light pixels lighter
          const contrast = 1.5; // Contrast factor
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          const newValue = factor * (avg - 128) + 128;

          // Apply the new value to all channels
          data[i] = data[i + 1] = data[i + 2] = newValue;
        }

        // Put the modified image data back on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Return the processed image as a data URL
        resolve(canvas.toDataURL("image/png"));
      };

      img.src = imageUrl;
    });
  };

  const processImage = async (file: File) => {
    try {
      if (!Tesseract) {
        errorMessage.value =
          "Text recognition library is not loaded yet. Please try again in a moment.";
        isProcessing.value = false;
        return;
      }

      // Convert the file to a data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Store original image for preview
      imagePreview.value = dataUrl;

      // Preprocess the image for better OCR results
      const processedImageUrl = await preprocessImage(dataUrl);

      // Create an image element with the processed image
      const img = new Image();
      img.src = processedImageUrl;

      // Wait for the image to load
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Use Tesseract.js v2.1.5 recognize method with French language
      Tesseract.recognize(
        img,
        "fra", // Use French language model
        {
          logger: (m: TesseractLogger) => {
            if (
              m.status === "recognizing text" && typeof m.progress === "number"
            ) {
              const progress = Math.round(m.progress * 100);
              console.log(`Recognition progress: ${progress}%`);
            }
          },
        },
      ).then((result: TesseractResult) => {
        const extractedText = result.data.text || "";

        // Clean up the text - remove extra spaces, fix common OCR errors
        const cleanedText = extractedText
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .replace(/(\w)'(\w)/g, "$1'$2") // Fix apostrophes
          .replace(/l'([aeiou])/gi, "l'$1") // Fix French articles
          .replace(/(\w)\.(\w)/g, "$1. $2") // Add space after periods
          .trim();

        detectedText.value = cleanedText;

        // Call the callback if provided
        if (onTextDetected) {
          onTextDetected(cleanedText);
        }

        isProcessing.value = false;
      }).catch((err: Error) => {
        console.error("Tesseract error:", err);
        errorMessage.value =
          "Failed to extract text from the image. Please try a clearer image.";
        isProcessing.value = false;
      });
    } catch (error) {
      console.error("Error processing image:", error);
      errorMessage.value =
        "Failed to process the image. Please try a different image.";
      isProcessing.value = false;
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const copyToClipboard = () => {
    if (detectedText.value) {
      navigator.clipboard.writeText(detectedText.value)
        .then(() => {
          // You could add a toast notification here
          console.log("Text copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  return (
    <div class="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 class="text-lg font-medium mb-2">Extract Text from Image</h3>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        class="hidden"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={isProcessing.value}
      >
        {isProcessing.value ? "Processing..." : "Upload Image"}
      </button>

      {errorMessage.value && (
        <div class="text-red-500 mb-2">{errorMessage.value}</div>
      )}

      {imagePreview.value && (
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Image Preview:</p>
          <img
            src={imagePreview.value}
            alt="Preview"
            class="max-w-full h-auto max-h-40 rounded border border-gray-300"
          />
        </div>
      )}

      {detectedText.value && (
        <div class="mt-4">
          <div class="flex justify-between items-center mb-2">
            <p class="text-sm font-medium text-gray-700">Detected Text:</p>
            <button
              type="button"
              onClick={copyToClipboard}
              class="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <div class="p-3 bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
            <p class="whitespace-pre-wrap text-sm">{detectedText.value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
