import React, { useState, useEffect, useRef } from "react"

import { Table } from "components/Table"

import { getRows } from "utils/helpers"

function App() {
  const [isLoading, toggleIsLoading] = useState(false)
  const [dataRows, setDataRows] = useState([])

  const currentPage = useRef(0)

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
      link: row.url,
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
        columns={[
          {
            id: "thumbnail",
            label: "Thumbnail",
            rightAlign: false,
            width: "250px",
          },
          {
            id: "title",
            label: "Title",
            rightAlign: false,
          },
        ]}
        rows={dataRows}
        visibleRows={4}
        rowHeight={200}
        isLoading={isLoading}
        onFetchMore={(searchVal) => {
          currentPage.current = currentPage.current + 1
          fetchRowsData(currentPage.current, searchVal)
        }}
        onRowClick={(row) => console.log(row)}
      />
    </div>
  )
}

export default App
