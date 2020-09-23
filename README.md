Components
----------

**src/components/Table/TableHead/index.js**

### 1. TableHead




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
withSelect|bool|no||
areAllSelected|bool|no||
onSelectAll|func|no||
columns|arrayOf|yes||
-----
**src/components/Table/TableRow/index.js**

### 1. TableRow




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
isSelected|bool|no||
onSelect|func|no||
onClick|func|no||
startRowIndex|number|yes||
data|custom|no||
config|shape|yes||
-----
**src/components/Table/index.js**

### 1. Table




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
className|string|no||
columns|arrayOf|yes||
rows|arrayOf|yes||
visibleRows|custom|no||
rowHeight|custom|no||
withSelect|bool|no||
isLoading|bool|no||
onSearch|func|no||
onRowClick|func|no||
onRowSelect|func|no||
onAllSelect|func|no||
onFetchMore|func|no||
-----

<sub>This document was generated by the <a href="https://github.com/marborkowski/react-doc-generator" target="_blank">**React DOC Generator v1.2.5**</a>.</sub>
