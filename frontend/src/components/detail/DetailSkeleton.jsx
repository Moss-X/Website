function DetailSkeleton() {
  return (
    <div className="container-page grid gap-12 py-12 lg:grid-cols-2" aria-busy="true" aria-label="Loading">
      <div className="aspect-square animate-pulse rounded-[28px] bg-placeholder" />
      <div className="flex flex-col gap-5 pt-4">
        <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-placeholder" />
        <div className="h-6 w-1/3 animate-pulse rounded-full bg-placeholder" />
        <div className="h-32 animate-pulse rounded-2xl bg-placeholder" />
        <div className="h-12 w-2/3 animate-pulse rounded-full bg-placeholder" />
      </div>
    </div>
  )
}

export default DetailSkeleton
