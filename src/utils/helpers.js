export const getRows = (pageNumber = 0, searchTerm = "") => {
  return fetch(
    `https://jsonplaceholder.typicode.com/photos?_page=${
      pageNumber + 1
    }&q=${searchTerm}`
  ).then((res) => res.json())
}

export const areObjectEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}
