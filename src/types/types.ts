export type GithubUser = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  followers: number
  following: number
  public_repos: number
  company: string | null
  location: string | null
  blog: string | null
  html_url: string
  created_at: string
}

export type GithubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  fork: boolean
  default_branch: string
  updated_at: string
}
