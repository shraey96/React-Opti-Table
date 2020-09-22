import React from "react"

export const TableHead = (props) => {
  const { columns, withSelect, areAllSelected, onSelectAll } = props
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
