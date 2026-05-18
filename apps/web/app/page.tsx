"use client"
import { NavBar } from "@/components/common/navbar"
import { ComboboxModify } from "@/components/modify/combobox-modify"

import { useState } from "react"

const frameworks = [
  { label: "me", value: "me" },
  { label: "me1", value: "me1" },
]
export default function Page() {
  const [framework, setFramework] = useState("me")
  return (
    <div className="relative flex min-h-svh flex-col px-6">
      <NavBar />
      <ComboboxModify
        options={frameworks}
        value={framework}
        onChange={(value) => {
          console.log(value) // selected option value
          setFramework(value)
        }}
      />
    </div>
  )
}
