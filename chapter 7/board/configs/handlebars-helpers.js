module.exports = {
  lengthOfList: (list = []) => list.length,
  eq: (val1, val2) => val1 === val2,
  dateString: (isoString) => new Date(isoString).toLocaleString(),
  toStringId: (id) =>
    id && typeof id.toString === "function" ? id.toString() : id || "",
};
