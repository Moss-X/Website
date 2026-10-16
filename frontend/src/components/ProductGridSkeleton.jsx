function ProductGridSkeleton({ count = 4 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="flex flex-col gap-3" aria-hidden="true">
      <div className="aspect-[4/5] animate-pulse rounded-[22px] bg-placeholder" />
      <div className="h-5 w-2/3 animate-pulse rounded-full bg-placeholder" />
      <div className="h-4 w-1/3 animate-pulse rounded-full bg-placeholder" />
    </div>
  ))
}

export default ProductGridSkeleton
