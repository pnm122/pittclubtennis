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
  onRowClick?: (row: T) => void
  onRowSelect?: (row: T | T[], selected: boolean) => void
}

export default function Table<T extends Row>({
  data,
  columns,
  renderMap,
  onRowClick,
  onRowSelect
}: Props<T>) {
  const CHECKBOX_WIDTH = 40 as const

  type SortedBy = {
    key?: string
    direction?: 'natural' | 'reverse'
  }

  const [rows, setRows] = useState(data)
  const [sortedBy, setSortedBy] = useState<SortedBy>({})
  // Selected row keys
  const [selected, setSelected] = useState<(T['key'])[]>([])

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

  const handleSelect = (row: T) => {
    setSelected(s => {
      if(onRowSelect) onRowSelect(row, !!s.includes(row.key))
      return (
        !!s.includes(row.key)
          ? s.filter(sel => sel !== row.key)
          : [...s, row.key]
      )
    })
  }

  const handleSelectAll = () => {
    setSelected(s => {
      if(onRowSelect) onRowSelect(rows, s.length !== rows.length)
      return (
        s.length === rows.length ? [] : rows.map(r => r.key)
      )
    })
  }

  return (
    <table className={styles["table"]}>
      <thead>
        <tr className={createClasses({
          [styles["table__header"]]: true,
          [styles["table__header--selected"]]: selected.length !== 0
        })}>
          <td 
            className={createClasses({
              [styles['checkbox']]: true,
              [styles['header-item']]: true
            })}
            style={widthStyles(CHECKBOX_WIDTH)}>
            <div className="with-hover-circle">
              <div
                role="checkbox"
                aria-checked={selected.length === rows.length ? true : selected.length > 0 ? 'mixed' : false}
                aria-label={selected.length === rows.length ? 'Deselect all rows' : 'Select all rows'}
                tabIndex={0}
                onClick={() => handleSelectAll()}
              />
            </div>
          </td>
          {selected.length > 0 && (
            <td className={styles['header-item']}>
              <p className={styles['items-selected']}>{selected.length} items selected</p>
            </td>
          )}
          {selected.length === 0 && columns.map(h => {
            const sortedNatural = h.key === sortedBy.key && sortedBy.direction === 'natural'
            const sortedReverse = h.key === sortedBy.key && sortedBy.direction === 'reverse'
            const sortButtonClasses = createClasses({
              [styles['header-item__sort']]: true,
              [styles['header-item__sort--sorted']]: sortedNatural || sortedReverse,
              'with-hover-circle': true
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
            [styles['table__row--striped']]: index % 2 !== 0,
            [styles['table__row--selected']]: selected.includes(row.key)
          })

          const checkboxClasses = createClasses({
            [styles['checkbox']]: true,
            [styles['item']]: true
          })

          return (
            <tr key={row.key} className={rowClasses}>
              <td className={checkboxClasses} style={widthStyles(CHECKBOX_WIDTH)}>
                <div className="with-hover-circle">
                  <div
                    role="checkbox"
                    aria-checked={selected.includes(row.key)}
                    aria-label={`Select row ${index + 1}`}
                    tabIndex={0}
                    onClick={() => handleSelect(row)}
                  />
                </div>
              </td>
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
