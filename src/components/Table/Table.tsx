import { useEffect, useState } from "react"
import { Column, Row, UnionFromRecord } from "types/Table"
import { TiArrowUnsorted, TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti"
import createClasses from "utils/createClasses"
import styles from "./Table.module.css"

interface Props<T extends Row> {
  data: T[]
  columns: Column<T>[]
  // For each key, make an object with a key of that name and the type for that key, then index by the original keys
  renderMap?: (value: UnionFromRecord<Omit<T, 'key'>>) => React.ReactNode
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

  const getColumn = (key: string) => {
    return columns.find(c => c.key === key)
  }

  const widthStyles = (width: number) => ({
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`
  })

  const handleSortRow = (key: string) => {
    // Reset sorting
    if(sortedBy.key === key && sortedBy.direction === 'reverse') {
      setSortedBy({})
      setRows(data)
      return
    }

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
    <table className={styles["table"]}>
      <thead>
        <tr className={styles["table__header"]}>
          {columns.map(h => {
            const sortedNatural = h.key === sortedBy.key && sortedBy.direction === 'natural'
            const sortedReverse = h.key === sortedBy.key && sortedBy.direction === 'reverse'
            const sortButtonClasses = createClasses({
              [styles['header-item__sort']]: true,
              [styles['header-item__sort--sorted']]: sortedNatural || sortedReverse
            })

            return (
              <td 
                className={styles["header-item"]}
                key={h.key as string}
                style={widthStyles(h.width)}>
                <p className={styles["header-item__name"]}>{h.name}</p>
                {h.sort && (
                  <button
                    className={sortButtonClasses}
                    onClick={() => handleSortRow(h.key as string)}>
                    {sortedNatural ? (
                      <TiArrowSortedDown></TiArrowSortedDown>
                    ) : sortedReverse ? (
                      <TiArrowSortedUp></TiArrowSortedUp>
                    ) : (
                      <TiArrowUnsorted></TiArrowUnsorted>
                    )}
                  </button>
                )}
              </td>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const rowClasses = createClasses({
            [styles['table__row']]: true,
            [styles['table__row--striped']]: index % 2 !== 0
          })

          return (
            <tr key={row.key} className={rowClasses}>
              {Object.keys(row).filter(key => key !== 'key').map(key => (
                <td key={key} className={styles["item"]} style={widthStyles(getColumn(key)!.width)}>
                  {renderMap && (
                    renderMap({
                      [key]: row[key]
                    } as any)
                  )}
                  {!renderMap && (
                    <p className={styles["item__text"]}>{row[key].toString()}</p>
                  )}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
