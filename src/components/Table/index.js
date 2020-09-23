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
    const { onFetchMore, isLoading, debounceTimer = 150 } = this.props

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
        }, debounceTimer)
      )
    }
  }

  componentWillUnmount() {
    this.tableRef.current.removeEventListener("scroll")
  }

  componentDidUpdate(prevProps) {
    const { rows } = this.props
    if (prevProps.rows.length !== rows.length) {
      this.manageScrollRowUpdate(this.tableRef.current.scrollTop)

      if (rows.length === 0) {
        this.setState({
          visibleRows: [],
        })

        return
      }

      if (this.isAllSelected) {
        this.selectAllRows(rows.slice(prevProps.rows.length, rows.length))
      }
    }
  }

  /**
   * Function to select all rows.
   * @param {Object[]} rows
   */
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

  /**
   * Function to slice array of mains rows accoridng to rowHeight + visibleRows + scrollPosition.
   * @param {number} scrollOffset
   */
  manageScrollRowUpdate = (scrollOffset) => {
    const { rowHeight, visibleRows, rows } = this.props

    const currentVisibleRowIndex = Math.floor(scrollOffset / rowHeight)

    const prevRowIndex = currentVisibleRowIndex - visibleRows * 2

    const nextRowIndex = currentVisibleRowIndex + visibleRows * 4

    const startRowIndex = prevRowIndex > 0 ? prevRowIndex : 0

    const updatedRows = []
    rows
      .slice(startRowIndex, currentVisibleRowIndex)
      .forEach((row) => updatedRows.push(row))
    rows
      .slice(currentVisibleRowIndex, nextRowIndex)
      .forEach((row) => updatedRows.push(row))

    this.setState({
      viewableRows: updatedRows,
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
      searchPlaceholder,
      isLoading,
    } = this.props

    const { viewableRows, startRowIndex, selectedItems } = this.state

    return (
      <div className={`table-container ${className}`}>
        {onSearch && (
          <div className="table-container__search">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
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
            {rows.length === 0 && !isLoading && (
              <p className="empty-items-text">No items found</p>
            )}

            <tbody ref={this.tableBodyRef} className="data-table-body">
              {viewableRows.map((r, i) => {
                return (
                  <TableRow
                    key={r.id}
                    data={r}
                    isSelected={selectedItems[r.id] || r.isSelected || false}
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
                            this.state.selectedItems
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
  /** additional classnames to add */
  className: PropTypes.string,

  /** array of columns config to add */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,

  /** array of data rows to display according to viewport */
  rows: PropTypes.arrayOf(rowsValidator).isRequired,

  /** number of visible rows to display */
  visibleRows: nonNegativeNumber,

  /** row height of each row to display */
  rowHeight: nonNegativeNumber,

  /** boolean to enable select/select all  */
  withSelect: PropTypes.bool,

  /** boolean for data loading indication */
  isLoading: PropTypes.bool,

  /** callback function for searchbox onChange */
  onSearch: PropTypes.func,

  /** callback function for row onClick */
  onRowClick: PropTypes.func,

  /** callback function for row select */
  onRowSelect: PropTypes.func,

  /** callback function for all rows select */
  onAllSelect: PropTypes.func,

  /** callback function for loading more data */
  onFetchMore: PropTypes.func,

  /** search placeholder for searchbox */
  searchPlaceholder: PropTypes.string,

  /** debounce timer for functions */
  debounceTimer: PropTypes.number,
}

Table.defaultProps = {
  /** value in ms */
  debounceTimer: 150,

  searchPlaceholder: "Search",

  isLoading: false,

  withSelect: false,

  rowHeight: 200,

  visibleRows: 10,
}
