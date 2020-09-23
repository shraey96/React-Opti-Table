import React, { useState, useEffect, useRef } from "react"

import { Table } from "components/Table"

import { debounceFn, getRows, getRowPayload } from "utils/helpers"

import "./base.scss"

let isFirstLoad = true

function App() {
  const [isLoading, toggleIsLoading] = useState(false)
  const [dataRows, setDataRows] = useState([])
  const [searchVal, setSearchVal] = useState("")

  const currentPage = useRef(1)

  const fetchRowsData = (
    page = currentPage.current,
    searchVal = "",
    withRest = false
  ) => {
    toggleIsLoading(true)
    return getRows(page, searchVal)
      .then((data) => {
        setDataRows((p) =>
          !withRest ? [...p, ...getRowPayload(data)] : getRowPayload(data)
        )
        isFirstLoad = false
      })
      .finally(() => toggleIsLoading(false))
  }

  const debouncedSearch = useRef(debounceFn(fetchRowsData, 1000))

  useEffect(() => {
    if (!isFirstLoad)
      debouncedSearch.current(currentPage.current, searchVal, true)
  }, [searchVal])

  useEffect(() => {
    fetchRowsData(currentPage.current, searchVal)
  }, [])

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
        searchPlaceholder="Search"
        debounceTimer={150}
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
