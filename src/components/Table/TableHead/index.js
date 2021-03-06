import React from "react"
import PropTypes from "prop-types"

export const TableHead = (props) => {
  const { columns, withSelect = false, areAllSelected, onSelectAll } = props
  return (
    <div className="table-head">
      {withSelect && (
        <div className="table-head__item table-head__item--checkbox">
          <input
            type="checkbox"
            className="checkbox"
            checked={areAllSelected}
            onChange={(e) => {
              onSelectAll && onSelectAll(e.target.checked)
            }}
          />
        </div>
      )}
      {columns.map((c) => {
        const style = {}
        if (c.width) {
          style.width = c.width
        } else {
          style.flex = 1
        }

        return (
          <div
            key={c.id}
            className={`table-head__item ${
              (c.rightAlign && "table-head__item--right") || ""
            } ${(c.leftAlign && "table-head__item--left") || ""}`}
            style={style}
          >
            {c.label}
          </div>
        )
      })}
    </div>
  )
}

TableHead.propTypes = {
  /** boolean to enable select/select all  */
  withSelect: PropTypes.bool,

  /** boolean for all selected */
  areAllSelected: PropTypes.bool,

  /** callback function for all rows select */
  onSelectAll: PropTypes.func,

  /** array of columns config to add */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
}

TableHead.defaultProps = {
  withSelect: false,
}
