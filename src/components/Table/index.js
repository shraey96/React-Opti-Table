import React, { Component, createRef } from "react"

import { TableRow } from "./TableRow"
import { TableHead } from "./TableHead"

import { areObjectEqual, debounceFn } from "utils/helpers"

import "./style.scss"

const BIG_LIST = new Array(1000)
  .fill()
  .map((x, y) => ({
    id: y,
    thumbnailUrl: "https://via.placeholder.com/150/771796",
    title: "reprehenderit est deserunt velit ipsam" + y,
    url: "https://via.placeholder.com/600/771796",
  }))
  .map((row) => ({
    id: `album_${row.id}`,
    thumbnail: (
      <img className="demo-thumbnail" src={row.thumbnailUrl} alt={row.title} />
    ),
    title: <span className="demo-title">{row.title}</span>,
    url: row.url,
  }))

export class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewableRows: props.rows.slice(0, props.visibleRows * 2),
      startRowIndex: 0,
      selectedItems: {},
    }

    this.tableRef = createRef()
    this.tableBodyRef = createRef()
    this.lastDownScrollPos = 0
  }

  componentDidMount() {
    const { onFetchMore, isLoading } = this.props

    if (onFetchMore) {
      const tableEle = this.tableRef.current

      tableEle.addEventListener(
        "scroll",
        debounceFn((e) => {
          const tableScrollTop = tableEle.scrollTop
          const tableOffsetHeight = tableEle.clientHeight

          let IS_SCROLLING_DOWN = false
          if (tableScrollTop > this.lastDownScrollPos) {
            IS_SCROLLING_DOWN = true
            this.lastDownScrollPos = tableScrollTop
          } else {
            IS_SCROLLING_DOWN = false
          }

          this.manageScrollRowUpdate(tableScrollTop)
          if (IS_SCROLLING_DOWN && !isLoading) {
            if ((tableScrollTop / tableOffsetHeight) * 100 > 70) {
              onFetchMore()
            }
          }
        }, 150)
      )
    }
  }

  componentWillUnmount() {
    this.tableRef.current.removeEventListener("scroll")
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rows.length !== this.props.rows.length) {
      this.manageScrollRowUpdate(this.tableRef.current.scrollTop)
    }
  }

  manageScrollRowUpdate = (scrollOffset) => {
    const { rowHeight, visibleRows, rows } = this.props

    const currentVisibleRowIndex = Math.floor(scrollOffset / rowHeight)

    const prevRowIndex = currentVisibleRowIndex - visibleRows * 2

    const nextRowIndex = currentVisibleRowIndex + visibleRows * 4

    const startRowIndex = prevRowIndex > 0 ? prevRowIndex : 0

    // console.log(`scrollOffset ==> `, scrollOffset)
    // console.log(`currentVisibleRowIndex ==> `, currentVisibleRowIndex)
    // console.log(`prevRowIndex ==> `, prevRowIndex)
    // console.log(`nextRowIndex ==> `, nextRowIndex)
    // console.log(`startRowIndex ==> `, startRowIndex)

    const mutatedComputedRows = []
    rows
      .slice(startRowIndex, currentVisibleRowIndex)
      .forEach((row) => mutatedComputedRows.push(row))
    rows
      .slice(currentVisibleRowIndex, nextRowIndex)
      .forEach((row) => mutatedComputedRows.push(row))

    this.setState({
      viewableRows: mutatedComputedRows,
      startRowIndex: startRowIndex,
    })
  }

  render() {
    const {
      rows,
      columns,
      onSearch,
      visibleRows,
      rowHeight,
      onRowClick,
    } = this.props

    const { viewableRows, startRowIndex, selectedItems } = this.state

    console.log(22, this.state)

    return (
      <div className="table-container">
        {onSearch && (
          <div className="table-container__search">
            <input
              type="search"
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search"
            />
          </div>
        )}

        <div className="table-container__wrapper">
          <table
            ref={this.tableRef}
            cellPadding="0"
            cellSpacing="0"
            style={{
              height: `${visibleRows * rowHeight}px`,
            }}
          >
            <thead>
              <TableHead
                columns={columns}
                areAllSelected={
                  Object.keys(selectedItems).length === rows.length
                }
                onSelectAll={(c) => {
                  if (c) {
                    const allSelected = rows.reduce((a, c, i) => {
                      return (a[c.id] = i)
                    }, {})

                    console.log(allSelected)
                  } else {
                    this.setState({ selectedItems: {} })
                  }
                }}
              />
            </thead>
            <tbody ref={this.tableBodyRef} className="data-table-body">
              {viewableRows.map((r, i) => {
                return (
                  <TableRow
                    key={r.id}
                    data={r}
                    isSelected={
                      selectedItems[r.id] &&
                      typeof selectedItems[r.id] !== "undefined"
                    }
                    startRowIndex={startRowIndex}
                    config={{ columns, rowHeight, index: i }}
                    onClick={() =>
                      onRowClick &&
                      onRowClick({ row: r, index: startRowIndex + i })
                    }
                    onSelect={(c) => {
                      const selectedClone = { ...selectedItems }
                      if (!c) {
                        delete selectedClone[r.id]
                      } else {
                        selectedClone[r.id] = i
                      }
                      this.setState({
                        selectedItems: selectedClone,
                      })
                    }}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
