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

export type GithubRepoRef = {
  full_name: string
  html_url: string
}

export type GithubRepoDetail = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  owner: {
    login: string
    avatar_url: string
    html_url: string
  }
  fork: boolean
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  default_branch: string
  size: number
  license: {
    key: string
    name: string
    spdx_id: string | null
  } | null
  topics?: string[]
  archived: boolean
  created_at: string
  updated_at: string
  pushed_at: string | null
  parent?: GithubRepoRef | null
  source?: GithubRepoRef | null
}

export type GithubContentEntry = {
  name: string
  path: string
  sha: string
  size: number
  type: 'file' | 'dir' | 'symlink' | 'submodule'
  html_url: string
  download_url: string | null
}
