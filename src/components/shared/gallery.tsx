import Image from "next/image"
import { Sprout } from "lucide-react"

export function Gallery({ fotos, alt }: { fotos: (string | null)[]; alt: string }) {
  const list = fotos.filter((f): f is string => Boolean(f))

  if (list.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Sprout className="size-12" />
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={list[0]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover"
          priority
        />
      </div>

      {list.length > 1 ? (
        <div className="grid grid-cols-2 gap-3">
          {list.slice(1).map((src, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <Image
                src={src}
                alt={alt + " foto " + (i + 2)}
                fill
                sizes="(max-width: 1024px) 50vw, 400px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
