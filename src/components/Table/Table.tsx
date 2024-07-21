import { useEffect, useState } from "react"
import { Column, Row, UnionFromRecord } from "types/Table"

interface Props<T extends Row> {
  data: T[],
  columns: Column<T>[],
  // For each key, make an object with a key of that name and the type for that key, then index by the original keys
  renderMap?: (value: UnionFromRecord<Omit<T, 'key'>>) => React.ReactNode,
}

export default function Table<T extends Row>({
  data,
  columns,
  renderMap
}: Props<T>) {
  type SortedBy = {
    key?: string
    direction?: 'natural' | 'reverse'
  }

  const [rows, setRows] = useState(data)
  const [sortedBy, setSortedBy] = useState<SortedBy>({})

  const handleSortRow = (key: string) => {
    const direction =
      sortedBy.key === key
        ? sortedBy.direction === 'natural' ? 'reverse' : 'natural'
        : 'natural'
    const sortMethod = columns.find(c => c.key === key)!.sort!
    
    setSortedBy({ key, direction })
    setRows(r => (
      // [].concat: stupid hack since sort updates in place and React detects that
      ([] as T[]).concat(r).sort((a, b) => (
        sortMethod(a[key], b[key]) * ((direction === 'natural') ? 1 : -1)
      ))
    ))
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map(h => (
            <td key={h.key as string}>
              {h.name}
              {h.sort && (
                <button
                  onClick={() => handleSortRow(h.key as string)}>
                  Sort
                </button>
              )}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.key}>
            {Object.keys(row).filter(key => key !== 'key').map(key => (
              <td key={key}>
                {renderMap && (
                  renderMap({
                    [key]: row[key]
                  } as any)
                )}
                {!renderMap && (
                  <div>{row[key].toString()}</div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
