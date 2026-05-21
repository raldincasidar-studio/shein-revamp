import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Camera,
  Upload,
  Sparkles,
  Download,
  Share2,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { client } from "@gradio/client";
import { Product } from "./ShoppingPage";

interface VirtualTryOnPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

async function urlToBlob(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
}

async function generateTryOnImage(
  personImageFile: File,
  productImageUrl: string,
): Promise<string> {
  const garmentBlob = await urlToBlob(productImageUrl);
  if (!garmentBlob) {
    throw new Error(
      "Could not load the product image. Please try again.",
    );
  }

  const app = await client("frogleo/AI-Clothes-Changer");
  const result = await app.predict("/infer", [
    personImageFile,
    garmentBlob,
    20,
    42,
  ]);

  const data = (result as any).data;
  const output = Array.isArray(data) ? data[0] : data;

  if (!output) {
    throw new Error(
      "No image was returned by the AI. Try a clearer full-body photo.",
    );
  }

  if (typeof output === "string") return output;
  if (output?.url) return output.url;
  if (output?.path) return output.path;

  throw new Error(
    "Unexpected response format. Please try again.",
  );
}

export default function VirtualTryOnPage({
  product,
  onBack,
  onAddToCart,
}: VirtualTryOnPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setUploadedFile(file);
    runAIGeneration(file);
  };

  const runAIGeneration = async (file: File) => {
    setStep(2);
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateTryOnImage(file, product.imageUrl);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    if (uploadedFile) {
      runAIGeneration(uploadedFile);
    }
  };

  const handleChangePhoto = () => {
    setStep(1);
    setUploadedImage(null);
    setUploadedFile(null);
    setGeneratedImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `tryon-${product.name.replace(/\s+/g, "-")}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white h-16 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div className="flex items-center gap-2 text-[#902cae]">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-sm md:text-lg font-bold text-gray-900 tracking-tight">
              AI Virtual Try-On
            </h1>
          </div>
        </div>
        <div className="text-xl md:text-3xl font-black tracking-widest uppercase text-gray-900">
          SHEIN
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex w-full relative">
        {step === 1 ? (
          <div className="w-full flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#e2beff] rounded-full flex items-center justify-center mb-6">
                <Camera className="w-12 h-12 text-[#902cae]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Try It On Yourself
              </h2>
              <p className="text-gray-500 mb-2 max-w-sm">
                Upload a full-body photo and our AI will dress you in this
                outfit
              </p>
              <p className="text-xs text-gray-400 mb-8 max-w-xs">
                Best results with a clear, well-lit, front-facing full-body
                photo
              </p>

              <div className="mb-6 w-full max-w-[200px]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover rounded-xl shadow-md"
                />
                <p className="text-xs text-gray-500 mt-2 font-medium line-clamp-1">
                  {product.name}
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-[240px]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#902cae] hover:bg-[#7D29A8] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </button>
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute("capture", "user");
                      fileInputRef.current.click();
                    }
                  }}
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-stretch">
            {/* Left: Generated Image */}
            <div className="flex-1 flex items-center justify-center relative p-8">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center text-white max-w-sm text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-[#902cae]/30 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-[#902cae] border-t-transparent rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#e2beff]" />
                  </div>
                  <h3 className="text-xl font-bold animate-pulse text-[#e2beff] mb-2">
                    AI is styling you...
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Applying{" "}
                    <span className="text-white font-medium">
                      {product.name}
                    </span>{" "}
                    to your photo
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    This may take 15–30 seconds
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-white max-w-sm text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-red-300 mb-2">
                    Generation Failed
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">{error}</p>
                  <div className="flex flex-col gap-3 w-full max-w-[220px]">
                    <button
                      onClick={handleRetry}
                      className="w-full bg-[#902cae] hover:bg-[#7D29A8] text-white py-2.5 rounded-lg font-bold text-sm transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleChangePhoto}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative h-full max-h-[calc(100vh-4rem)] w-full flex items-center justify-center">
                  <img
                    src={generatedImage || product.imageUrl}
                    alt="Virtual Try-On Result"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-[#902cae] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Generated
                  </div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/30 hidden md:block"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/30 hidden md:block"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/30 hidden md:block"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/30 hidden md:block"></div>
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="w-[320px] bg-white shrink-0 hidden md:flex flex-col border-l border-gray-200 p-6 overflow-y-auto z-10 sticky top-16 h-[calc(100vh-4rem)]">
              <div className="mb-8 p-4 border border-gray-200 rounded-sm shadow-sm relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover mb-3"
                />
                <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <p className="text-[10px] text-gray-500 mb-2">
                  SKU: sz2411181028155675
                </p>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-[10px] text-gray-500 ml-1">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <div className="font-bold text-lg text-gray-900">
                  ₱{product.price}
                </div>
              </div>

              {uploadedImage && !isGenerating && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Your Photo
                  </p>
                  <img
                    src={uploadedImage}
                    alt="Your upload"
                    className="w-full aspect-[3/4] object-cover rounded border border-gray-200"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 mt-auto">
                <button
                  disabled={isGenerating || !!error}
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-black text-white font-bold py-3 px-4 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  disabled={isGenerating || !generatedImage}
                  onClick={handleDownload}
                  className="w-full bg-white border border-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Save Result
                </button>
                <button
                  disabled={isGenerating}
                  className="w-full bg-white border border-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                {!isGenerating && !error && generatedImage && (
                  <button
                    onClick={handleRetry}
                    className="w-full bg-[#f3e8ff] border border-[#c084fc] text-[#7e22ce] font-medium py-2.5 px-4 rounded hover:bg-[#ede9fe] transition-colors flex items-center justify-center gap-2 mt-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    Regenerate
                  </button>
                )}
                <button
                  onClick={handleChangePhoto}
                  className="w-full bg-white border border-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded hover:bg-gray-50 transition-colors mt-1 disabled:opacity-50"
                >
                  Change Photo
                </button>
              </div>
            </div>

            {/* Mobile Actions Overlay */}
            {!isGenerating && !error && step === 2 && (
              <div className="md:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-20 flex flex-col gap-3 z-10">
                <div className="flex gap-3 mb-2">
                  <button
                    onClick={handleDownload}
                    disabled={!generatedImage}
                    className="flex-1 bg-white text-black font-bold py-3 rounded-full hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-5 h-5" /> Save
                  </button>
                  <button className="flex-1 bg-white text-black font-bold py-3 rounded-full hover:bg-gray-100 flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-[#902cae] hover:bg-[#7D29A8] text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button
                  onClick={handleChangePhoto}
                  className="w-full text-white/80 font-medium py-2 text-sm mt-2"
                >
                  Change Photo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
