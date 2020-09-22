import React from "react"

export const TableHead = (props) => {
  const { areAllSelected, onSelectAll } = props
  return (
    <tr className="table-head">
      <th className="table-head-item">
        <input
          type="checkbox"
          className="checkbox"
          checked={areAllSelected}
          onChange={(e) => {
            onSelectAll && onSelectAll(e.target.checked)
          }}
        />
      </th>
      {/* <td className="table-row-item">{data}</td> */}
    </tr>
  )
}
