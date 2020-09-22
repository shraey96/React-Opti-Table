import React, { Component, createRef } from "react"

import { TableRow } from "./TableRow"
import { TableHead } from "./TableHead"

import { areObjectEqual } from "utils/helpers"

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
      viewableRows: BIG_LIST.slice(0, props.visibleRows * 2),
      startRowIndex: 0,
      selectedItems: {},
    }
    this.page = 0
    this.tableRef = createRef()
    this.tableBodyRef = createRef()
  }

  componentDidMount() {
    const { onFetchMore, isLoading } = this.props

    if (onFetchMore) {
      const tableEle = this.tableRef.current
      const tableBodyEle = this.tableBodyRef.current
      tableEle.addEventListener("scroll", (e) => {
        // Compute client height on scroll for dynamic height
        const tableScrollTop = tableEle.scrollTop
        const tableOffsetHeight = tableEle.clientHeight
        const tableBodyScrollHeight = tableBodyEle.scrollHeight
        // debounce(this._handleRowVisibility.bind(this), 200)(tableScrollTop)
        this.manageScrollRowUpdate(tableScrollTop)
        if (!isLoading) {
          if (tableBodyScrollHeight - tableOffsetHeight <= tableScrollTop) {
            this.page = this.page + 1
            onFetchMore(this.page)
            // .then(() =>
            //   this.manageScrollRowUpdate(tableScrollTop)
            // )
          }
        }
      })
    }
  }

  componentWillUnmount() {
    this.tableRef.current.removeEventListener("scroll")
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rows.length !== this.props.rows.length) {
      // this.setState({
      //   viewableRows: this.props.rows.slice(0, this.props.visibleRows * 2),
      // })
      // this.manageScrollRowUpdate(this.tableRef.current.scrollHeight)
    }
  }

  manageScrollRowUpdate = (scrollOffset) => {
    // const rows = BIG_LIST
    const { rowHeight, visibleRows, rows } = this.props
    // console.log(111, `manageScrollRowUpdate==> `, rows)
    // const {  } = this.state

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
    const { rows, onSearch, visibleRows, rowHeight, onRowClick } = this.props

    const { viewableRows, startRowIndex = 0, selectedItems } = this.state

    console.log(22, this.state)
    // console.log(33, this.props)

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
            <TableHead
              areAllSelected={Object.keys(selectedItems).length === rows.length}
              onSelectAll={(c) => {
                console.log(c)
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
            <tbody ref={this.tableBodyRef} className="data-table-body">
              {viewableRows.map((r, i) => {
                return (
                  <TableRow
                    key={r.id}
                    index={i}
                    data={r}
                    isSelected={
                      selectedItems[r.id] &&
                      typeof selectedItems[r.id] !== "undefined"
                    }
                    startRowIndex={startRowIndex}
                    rowHeight={rowHeight}
                    onClick={() => onRowClick && onRowClick()}
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
