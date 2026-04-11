interface PasteCardProps {
  image: string | null;
}

export const PasteCard = ({ image }: PasteCardProps) => {
  if (!image) return null;

  return (
    <div className="glass p-4 rounded-3xl w-full max-w-4xl mx-auto transition-all duration-500 shadow-2xl animate-in fade-in zoom-in duration-700">
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner">
        <img 
          src={image} 
          alt="Pasted content" 
          className="w-full h-auto max-h-[75vh] object-contain mx-auto transition-transform duration-500 hover:scale-[1.01]"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
      </div>
    </div>
  );
};
