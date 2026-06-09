export function SkeletonCard() {
  return (
    <div className="ayur-card p-5 animate-pulse">
      <div className="skeleton mb-3 h-4 w-[75%]" />
      <div className="skeleton mb-2 h-3 w-full" />
      <div className="skeleton mb-4 h-3 w-2/3" />
      <div className="skeleton h-8 w-1/3" />
    </div>
  );
}
