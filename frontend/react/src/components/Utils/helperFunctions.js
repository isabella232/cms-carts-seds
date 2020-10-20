// This function extracts just the unique ID
// from all objectives & goals, stopping at the underscore

const sliceId = (id) => {
  const idString = id.toString();
  const num = idString.slice(idString.indexOf("_", idString.length - 1));
  return num;
};

export default sliceId;
