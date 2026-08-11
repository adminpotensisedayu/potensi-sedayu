import { Skeleton, SkeletonGrid } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton className="mb-6 h-9 w-48" />
      <SkeletonGrid count={6} />
    </section>
  )
}