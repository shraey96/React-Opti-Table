import React from "react"

/**
 * Function to fetch data from api.
 * @param {number} pageNumber
 * @param {string} searchTerm
 */
export const getRows = (pageNumber = 0, searchTerm = "") => {
  return fetch(
    `https://jsonplaceholder.typicode.com/photos?_page=${pageNumber}&q=${searchTerm}`
  ).then((res) => res.json())
}

/**
 * Function to return modified data for ui.
 * @param {Object[]} rows
 */
export const getRowPayload = (rows) => {
  return rows.map((row) => ({
    id: `row__${row.id}`,
    thumbnail: (
      <img className="demo-thumbnail" src={row.thumbnailUrl} alt={row.title} />
    ),
    title: <span className="demo-title">{row.title}</span>,
    link: row.url,
  }))
}

/**
 * Function to debounce given function over a delay.
 * @param {Function} fn
 * @param {number} delay
 */
export const debounceFn = (fn, delay) => {
  let timeout = null
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(null, args)
    }, delay)
  }
}

// Prop Validators //

/**
 * Function to check given prop is non negative number.
 * @param {Object} props
 * @param {string} propName
 * @param {string} componentName
 */
export const nonNegativeNumber = (props, propName, componentName) => {
  const propVal = props[propName]
  if (isNaN(propVal) || propVal <= 0) {
    throw new Error(
      `Prop Validation Error: Invalid prop ${propName} supplied to ${componentName}`
    )
  }
}

/**
 * Function to validate props for rows in component.
 * @param {Object} props
 * @param {string} propName
 * @param {string} componentName
 */

export const rowsValidator = (props, propName, componentName) => {
  const propVal = props[propName]

  if (!propVal instanceof Object) {
    throw new Error(
      `Prop Validation Error: Invalid prop ${propName} supplied to ${componentName}`
    )
  }

  const propKeys = Object.keys(propVal)

  if (!propVal["id"]) {
    throw new Error(`Prop Validation Error: Prop ${propName} missing key {id} `)
  }

  propKeys.forEach((key) => {
    if (key === "id" && typeof propVal[key] !== "string") {
      throw new TypeError(
        `Prop Validation Error: Prop ${propName}[${key}] type is invalid`
      )
    } else if (
      !(
        typeof propVal[key] === "string" ||
        !isNaN(Number(propVal[key])) ||
        React.isValidElement(propVal[key])
      )
    ) {
      throw new TypeError(
        `Prop Validation Error: Prop ${propName}[${key}] type is invalid`
      )
    }
  })
}
