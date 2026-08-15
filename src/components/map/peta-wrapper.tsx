"use client"

import dynamic from "next/dynamic"
import type { MapPoint } from "./peta-explorer"

// dynamic + ssr:false WAJIB ada di Client Component
const PetaExplorer = dynamic(() => import("./peta-explorer"), { ssr: false })

export default function PetaWrapper({ points }: { points: MapPoint[] }) {
  return <PetaExplorer points={points} />
}
