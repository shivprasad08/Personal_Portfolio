import { useEffect, useState } from "react"

const ROLES = [
  "Full Stack Developer",
  "Problem Solver",
  "AI/ML Enthusiast",
]

const TYPE_SPEED = 60
const DELETE_SPEED = 35
const PAUSE_TYPED = 1800
const PAUSE_DELETED = 400

export function useTypewriter() {
  const [text, setText] = useState("")
  const [roleIndex, setRoleIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = ROLES[roleIndex]
    let t: ReturnType<typeof setTimeout>

    if (!deleting && text === current) {
      t = setTimeout(() => setDeleting(true), PAUSE_TYPED)
    } else if (deleting && text === "") {
      setDeleting(false)
      setRoleIndex((i) => (i + 1) % ROLES.length)
      t = setTimeout(() => {}, PAUSE_DELETED)
    } else if (deleting) {
      t = setTimeout(() => setText((p) => p.slice(0, -1)), DELETE_SPEED)
    } else {
      t = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPE_SPEED)
    }

    return () => clearTimeout(t)
  }, [text, deleting, roleIndex])

  return text
}
