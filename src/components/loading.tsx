export function Loading({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2 text-muted-foreground justify-center text-[14px]">
      <span>{text} </span>
      <div className="flex gap-1">
        <span className="animate-bounce">•</span>
        <span className="animate-bounce delay-100">•</span>
        <span className="animate-bounce delay-200">•</span>
      </div>
    </span>
  );
}
