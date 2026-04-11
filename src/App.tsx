import { Download, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { PasteCard } from "./components/PasteCard";

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isPasting, setIsPasting] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  useEffect(() => {
    if (image) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [image]);

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      let foundImage = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setIsPasting(true);
            const url = URL.createObjectURL(file);

            // Cleanup old URL to prevent memory leaks
            if (image) URL.revokeObjectURL(image);

            setImage(url);
            foundImage = true;

            toast.success("Image captured!", {
              description: `Successfully imported ${file.name || "image"} from clipboard.`,
              icon: <Sparkles className="text-amber-400" size={18} />,
            });

            setTimeout(() => setIsPasting(false), 500);
            break;
          }
        }
      }

      if (!foundImage && e.clipboardData?.types.length) {
        toast.error("No image found", {
          description: "Your clipboard doesn't seem to contain an image.",
        });
      }
    },
    [image],
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const downloadImage = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = `clip-download-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.info("Preparing download...", {
      description: "Your image is being saved as a PNG file.",
    });
  };

  return (
    <main
      className={`relative w-full transition-colors duration-700 ${!image ? "bg-neutral-950 text-white" : "bg-black text-white"}`}
    >
      <div className="relative flex flex-col items-center justify-center min-h-[100vh] p-8">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[160px] opacity-[0.07] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[160px] opacity-[0.07] animate-pulse delay-1000" />
        </div>

        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            className:
              "glass !bg-black/80 !border-white/10 !text-white !rounded-2xl !p-4 !shadow-2xl",
          }}
        />

        <div
          className={`w-full max-w-4xl transition-all duration-700 ${isPasting ? "scale-[0.99] opacity-90" : "scale-100 opacity-100"}`}
        >
          {!image && (
            <header className="mb-12 space-y-4 text-center duration-1000 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-6xl font-black tracking-tighter text-transparent text-white sm:text-7xl bg-clip-text bg-gradient-to-b from-white to-white/40">
                ClipDownload
              </h1>
              <p className="max-w-md mx-auto text-xl font-medium leading-relaxed text-white/40">
                Press{" "}
                <kbd className="px-2 py-1 ml-1 mr-1 font-mono text-base rounded bg-white/10 text-white/80">
                  {isMac ? "Cmd" : "Ctrl"} + V
                </kbd>{" "}
                anywhere on the screen to capture an image.
              </p>
            </header>
          )}

          <div
            className="relative"
            role="region"
            aria-live="polite"
            aria-label="Image preview and download area"
          >
            <PasteCard image={image} />

            {image && (
              <div className="flex flex-col items-center gap-6 mt-12 duration-700 animate-in slide-in-from-top-4 fade-in">
                <button
                  onClick={downloadImage}
                  aria-label="Download the captured image as a PNG file"
                  className="flex items-center gap-3 px-12 py-6 bg-white text-black font-black text-lg rounded-2xl hover:bg-neutral-200 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 group/btn"
                >
                  <Download
                    size={24}
                    aria-hidden="true"
                    className="group-hover/btn:translate-y-0.5 transition-transform"
                  />
                  Download PNG
                </button>
                <p
                  className="text-sm font-bold tracking-widest uppercase text-white/20"
                  aria-hidden="true"
                >
                  New paste replaces current image
                </p>
              </div>
            )}
          </div>

          {!image && (
            <div
              className="absolute left-0 right-0 flex flex-col items-center duration-1000 delay-500 -bottom-12 animate-in fade-in"
              aria-hidden="true"
            >
              <div className="w-px h-12 mb-3 bg-gradient-to-b from-transparent to-white/20" />
              <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                Scroll to learn more
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SEO Information Section - Scrollable */}
      {!image && (
        <div
          className="w-full px-8 pb-32 mx-auto max-w-7xl"
          role="complementary"
          aria-label="Tool Information"
        >
          <div className="grid grid-cols-1 gap-8 pt-24 text-left md:grid-cols-2 lg:grid-cols-3">
            <section className="glass p-8 rounded-3xl space-y-4 border border-white/5 transition-transform hover:scale-[1.02] duration-500">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
                How to Use ClipDownload
              </h2>
              <div className="space-y-4 font-medium leading-relaxed text-white/60">
                <p>
                  ClipDownload is designed for speed. Whether you're a designer
                  needing a quick screenshot export or a developer capturing
                  code snippets, our tool works instantly.
                </p>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>
                    Copy an image (Right-click &gt; Copy Image or Win+Shift+S).
                  </li>
                  <li>
                    Focus this window and press{" "}
                    <kbd className="px-1 text-xs rounded bg-white/10">
                      {isMac ? "Cmd" : "Ctrl"}+V
                    </kbd>
                    .
                  </li>
                  <li>
                    Click download to save your image as a high-quality PNG.
                  </li>
                </ol>
              </div>
            </section>

            <section className="glass p-8 rounded-3xl space-y-4 border border-white/5 transition-transform hover:scale-[1.02] duration-500">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
                Why ClipDownload?
              </h2>
              <div className="space-y-4 font-medium leading-relaxed text-white/60">
                <p>
                  Unlike other{" "}
                  <span className="font-bold text-white">
                    online clipboard to png
                  </span>{" "}
                  tools, ClipDownload prioritizes your privacy through 100%
                  client-side processing.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="font-bold text-emerald-400">✓</span>
                    <span>
                      Convert clipboard to png online without any uploads.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-emerald-400">✓</span>
                    <span>
                      Secure, private clipboard image capture for developers.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-emerald-400">✓</span>
                    <span>
                      Instant export for screenshots and design assets.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="glass p-8 rounded-3xl space-y-4 border border-white/5 md:col-span-2 lg:col-span-1 transition-transform hover:scale-[1.02] duration-500">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 text-sm font-bold text-white">
                    Is it private?
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    Yes. All processing happens in your browser. No image data
                    is ever sent to our servers.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-white">
                    What formats are supported?
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    Any image data stored in your clipboard can be captured and
                    converted to a standard PNG file.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      <footer className="w-full py-12 text-center border-t border-white/5 opacity-40">
        <p className="font-mono text-xs tracking-widest uppercase text-white/20">
          Private • Zero Uploads • 100% Local
        </p>
      </footer>
    </main>
  );
}

export default App;
