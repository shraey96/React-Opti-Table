import React, { Component, createRef } from "react"

import PropTypes from "prop-types"

import { TableRow } from "./TableRow"
import { TableHead } from "./TableHead"

import { debounceFn, nonNegativeNumber, rowsValidator } from "utils/helpers"

import "./style.scss"

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
    this.isAllSelected = false
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

      if (this.isAllSelected) {
        this.selectAllRows(
          this.props.rows.slice(prevProps.rows.length, this.props.rows.length)
        )
      }
    }
  }

  selectAllRows = (rows) => {
    const { startRowIndex } = this.state

    const allSelected = rows.reduce((a, c, i) => {
      a[c.id] = `selected_${startRowIndex + i}`
      return a
    }, {})
    this.setState({
      selectedItems: { ...this.state.selectedItems, ...allSelected },
    })
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
      className = "",
      rows,
      columns,
      visibleRows,
      withSelect,
      rowHeight,
      onSearch,
      onRowClick,
      onRowSelect,
      onAllSelect,
      searchVal,
    } = this.props

    const { viewableRows, startRowIndex, selectedItems } = this.state

    return (
      <div className={`table-container ${className}`}>
        {onSearch && (
          <div className="table-container__search">
            <input
              type="search"
              value={searchVal}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search"
            />
          </div>
        )}

        <div className="table-container__wrapper">
          <TableHead
            columns={columns}
            withSelect={withSelect}
            areAllSelected={
              (Object.keys(selectedItems).length === rows.length &&
                rows.length !== 0) ||
              false
            }
            onSelectAll={(c) => {
              if (c) {
                this.isAllSelected = true
                this.selectAllRows(rows)
                onAllSelect && onAllSelect(true)
              } else {
                this.isAllSelected = false
                this.setState(
                  { selectedItems: {} },
                  () => onAllSelect && onAllSelect(false)
                )
              }
            }}
          />

          <table
            ref={this.tableRef}
            cellPadding="0"
            cellSpacing="0"
            style={{
              height: `${visibleRows * rowHeight}px`,
            }}
          >
            <tbody ref={this.tableBodyRef} className="data-table-body">
              {viewableRows.map((r, i) => {
                return (
                  <TableRow
                    key={r.id}
                    data={r}
                    isSelected={selectedItems[r.id] || false}
                    startRowIndex={startRowIndex}
                    config={{ columns, rowHeight, index: i, withSelect }}
                    onClick={() =>
                      onRowClick &&
                      onRowClick({ row: r, index: startRowIndex + i })
                    }
                    onSelect={(c) => {
                      const selectedClone = { ...selectedItems }
                      if (!c) {
                        delete selectedClone[r.id]
                        this.isAllSelected = false
                      } else {
                        selectedClone[r.id] = `selected_${startRowIndex + i}`
                      }
                      this.setState(
                        {
                          selectedItems: selectedClone,
                        },
                        () =>
                          onRowSelect &&
                          onRowSelect(
                            { row: r, index: startRowIndex + i },
                            selectedItems
                          )
                      )
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

Table.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,

  rows: PropTypes.arrayOf(rowsValidator).isRequired,

  visibleRows: nonNegativeNumber,
  rowHeight: nonNegativeNumber,
  withSelect: PropTypes.bool,
  isLoading: PropTypes.bool,
  onSearch: PropTypes.func,
  onRowClick: PropTypes.func,
  onRowSelect: PropTypes.func,
  onAllSelect: PropTypes.func,
  onFetchMore: PropTypes.func,
}
