export interface Project {
  id: number
  title: string
  subtitle: string
  description: string
  tags: string[]
  stack: string[]
  github: string
  featured: boolean
  color: string
}

export interface ExperienceItem {
  id: number
  title: string
  subtitle: string
  company: string
  location: string
  period: string
  current: boolean
  bullets: string[]
}

export interface Skill {
  category: string
  icon: string
  color: string
  items: string[]
}