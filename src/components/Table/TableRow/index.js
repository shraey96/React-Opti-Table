import React from "react"
import PropTypes from "prop-types"

import { rowsValidator } from "utils/helpers"

export const TableRow = (props) => {
  const { data, config, startRowIndex, isSelected, onClick, onSelect } = props

  const { rowHeight, columns, index, withSelect } = config

  return (
    <tr
      key={data.id}
      className="table-row"
      id={`table-row-${data.id}`}
      onClick={(_) => onClick && onClick()}
      style={{
        height: `${rowHeight}px`,
        top: `${(startRowIndex + index) * rowHeight}px`,
      }}
    >
      {withSelect && (
        <td className="table-row__item">
          <input
            type="checkbox"
            className="checkbox"
            checked={isSelected}
            onClick={(e) => {
              e.stopPropagation()
            }}
            onChange={(e) => {
              onSelect && onSelect(e.target.checked)
            }}
          />
        </td>
      )}

      {columns.map((c, i) => {
        const style = {}
        if (c.width) {
          style.width = c.width
        } else {
          style.flex = 1
        }

        return (
          <td
            key={i}
            className={`table-row__item ${
              c.rightAlign && "table-row__item--right"
            }`}
            style={style}
          >
            {data[c.id] || "-"}
          </td>
        )
      })}
    </tr>
  )
}

TableRow.propTypes = {
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  onClick: PropTypes.func,
  startRowIndex: PropTypes.number.isRequired,

  data: rowsValidator,
  config: PropTypes.shape({
    stickyHeader: PropTypes.bool,
    rowHeight: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ).isRequired,
    index: PropTypes.number.isRequired,
    withSelect: PropTypes.bool.isRequired,
  }).isRequired,
}
