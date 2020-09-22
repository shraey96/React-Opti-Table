import React, { useState, useEffect, useRef } from "react"

import { Table } from "components/Table"

import { debounceFn, getRows, getRowPayload } from "utils/helpers"

import "./base.scss"

function App() {
  const [isLoading, toggleIsLoading] = useState(false)
  const [dataRows, setDataRows] = useState([])
  const [searchVal, setSearchVal] = useState("")

  const currentPage = useRef(1)

  const fetchRowsData = (page, searchVal) => {
    toggleIsLoading(true)
    return getRows(page, searchVal)
      .then((data) => {
        setDataRows((p) => [...p, ...getRowPayload(data)])
      })
      .finally(() => toggleIsLoading(false))
  }

  useEffect(() => {
    fetchRowsData(currentPage.current, searchVal)
  }, [])

  const debouncedSearch = useRef(debounceFn(fetchRowsData, 1000))

  useEffect(() => {
    debouncedSearch.current(currentPage.current, searchVal)
  }, [searchVal])

  console.log(dataRows)

  return (
    <div className="App">
      {isLoading && <div className="loader" />}
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
        withSelect
        onFetchMore={() => {
          currentPage.current = currentPage.current + 1
          fetchRowsData(currentPage.current, searchVal)
        }}
        onSearch={(val) => setSearchVal(val)}
        onRowClick={(row) => console.log(`rowClicked: `, row)}
        onRowSelect={(row, list) => console.log(`rowSelected: `, row, list)}
        onAllSelect={(allSelected) => console.log(`allSelected: `, allSelected)}
      />
    </div>
  )
}

export default App
