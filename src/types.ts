
export type RepositoryInfo = {
    name: string,
    branch?: string,
    secret: string,
    path: string,
    action: string
}

export type ConfigFile = {
    port: number,
    repositories: RepositoryInfo[]
}