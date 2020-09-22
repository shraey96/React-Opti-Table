import React from "react"

export const TableRow = (props) => {
  const { startRowIndex, data, config, isSelected, onClick, onSelect } = props

  const { rowHeight, columns, index } = config

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

      {columns.map((c) => {
        const style = {}
        if (c.width) {
          style.width = c.width
        } else {
          style.flex = 1
        }

        return (
          <td
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
