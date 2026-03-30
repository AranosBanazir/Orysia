 function cap(str) {
  if (!str) return str; // handles empty/null
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export {cap}