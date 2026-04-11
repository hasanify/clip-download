import { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import { Download, Sparkles } from 'lucide-react';
import { PasteCard } from './components/PasteCard';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isPasting, setIsPasting] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    let foundImage = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setIsPasting(true);
          const url = URL.createObjectURL(file);
          
          // Cleanup old URL to prevent memory leaks
          if (image) URL.revokeObjectURL(image);
          
          setImage(url);
          foundImage = true;
          
          toast.success("Image captured!", {
            description: `Successfully imported ${file.name || 'image'} from clipboard.`,
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
  }, [image]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const downloadImage = () => {
    if (!image) return;
    
    const link = document.createElement('a');
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
      className={`relative flex flex-col items-center justify-center min-h-screen p-8 transition-colors duration-700 ${!image ? 'bg-neutral-950' : 'bg-black'}`}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[160px] opacity-[0.07] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[160px] opacity-[0.07] animate-pulse delay-1000" />
      </div>
      
      <Toaster 
        theme="dark" 
        position="top-center"
        toastOptions={{
          className: 'glass !bg-black/80 !border-white/10 !text-white !rounded-2xl !p-4 !shadow-2xl',
        }}
      />
      
      <div className={`w-full max-w-4xl transition-all duration-700 ${isPasting ? 'scale-[0.99] opacity-90' : 'scale-100 opacity-100'}`}>
        {!image && (
          <header className="mb-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-6xl font-black tracking-tighter text-white sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              ClipDownload
            </h1>
            <p className="text-xl text-white/40 font-medium max-w-md mx-auto leading-relaxed">
              Press <kbd className="px-2 py-1 rounded bg-white/10 text-white/80 font-mono text-base ml-1 mr-1">{isMac ? 'Cmd' : 'Ctrl'} + V</kbd> anywhere on the screen to capture an image.
            </p>
          </header>
        )}

        <div className="relative">
          <PasteCard image={image} />
          
          {image && (
            <div className="mt-12 flex flex-col items-center gap-6 animate-in slide-in-from-top-4 fade-in duration-700">
              <button 
                onClick={downloadImage}
                className="flex items-center gap-3 px-12 py-6 bg-white text-black font-black text-lg rounded-2xl hover:bg-neutral-200 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 group/btn"
              >
                <Download size={24} className="group-hover/btn:translate-y-0.5 transition-transform" />
                Download PNG
              </button>
              <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
                New paste replaces current image
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="absolute bottom-8 text-center w-full pointer-events-none opacity-40">
        <p className="text-white/20 text-xs font-mono tracking-widest uppercase">
          Private • Zero Uploads • 100% Local
        </p>
      </footer>
    </main>
  );
}

export default App;
