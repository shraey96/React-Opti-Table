import React, { useState, useEffect } from "react"

import { Table } from "components/Table"

import { getRows } from "utils/helpers"

function App() {
  const [isLoading, toggleIsLoading] = useState(false)
  const [dataRows, setDataRows] = useState([])

  const getRowPayload = (rows) => {
    return rows.map((row) => ({
      id: `album_${row.id}`,
      thumbnail: (
        <img
          className="demo-thumbnail"
          src={row.thumbnailUrl}
          alt={row.title}
        />
      ),
      title: <span className="demo-title">{row.title}</span>,
      url: row.url,
    }))
  }

  const fetchRowsData = (page, searchVal) => {
    toggleIsLoading(true)
    return getRows(page, searchVal)
      .then((data) => {
        setDataRows((p) => [...p, ...getRowPayload(data)])
      })
      .finally(() => toggleIsLoading(false))
  }

  useEffect(() => {
    fetchRowsData()
  }, [])

  return (
    <div className="App">
      <Table
        rows={dataRows}
        visibleRows={4}
        rowHeight={200}
        onFetchMore={(page, searchVal) => fetchRowsData(page, searchVal)}
      />
    </div>
  )
}

export default App
