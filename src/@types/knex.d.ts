// eslint-disable-next-line @typescript-eslint/no-unused-vars

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: string
    }
    snacks: {
      id: string
      name: string
      session_id: string
      description: string
      isValidDiet: boolean
      created_at: string
    }
  }
}
