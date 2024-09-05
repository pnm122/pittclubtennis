export type Row = Readonly<Record<string, any> & { key: any }>
export type RowWithoutKey<T extends Row> = Omit<T, 'key'>

export type UnionFromRecord<T extends Record<string, any>> = {
  [key in keyof T]: { [P in key]: T[key] }
}[keyof T]

export type Column<
  T extends Row,
  K extends keyof RowWithoutKey<T> = keyof RowWithoutKey<T>
> = {
  key: K
  name: string
  width: number
  /**
   * Whether to allow content to overflow from each item box within the column
   * @default false
   */
  allowOverflow?: boolean
  sort?: (a: any, b: any) => number
}
