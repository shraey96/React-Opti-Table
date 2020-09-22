import React from "react"

export const TableRow = (props) => {
  const {
    rowHeight,
    startRowIndex,
    data,
    index,
    isSelected,
    onClick,
    onSelect,
  } = props
  return (
    <tr
      key={data.id}
      className="table-row"
      onClick={(_) => onClick && onClick()}
      style={{
        height: `${rowHeight}px`,
        top: `${(startRowIndex + index) * rowHeight}px`,
      }}
    >
      <td className="table-row-item">
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
      <td className="table-row-item">{data.thumbnail}</td>
      <td className="table-row-item">{data.title}</td>
    </tr>
  )
}
