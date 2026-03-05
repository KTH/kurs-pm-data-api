function createMemoLink({ courseCode, memoEndPoint }) {
  return `${process.env.BASE_URL}${courseCode}/${memoEndPoint}`
}

module.exports = {
  createMemoLink,
}
