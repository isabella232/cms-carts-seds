const setNull = (obj) => {
  if (obj !== null) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        setNull(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((child, i) => {
          if (typeof child !== "object" && !Array.isArray(child)) {
            obj[key][i] = null;
          } else {
            setNull(child);
          }
        });
      } else {
        obj[key] = null;
      }
    });
  }
};

export const setFormHash = async (formData) => {
  // First make a copy, so we don't ruin the data that was passed in. Then
  // remove all of its internal data, so we're just left with a structure.
  const structure = JSON.parse(JSON.stringify(formData));
  setNull(structure);

  // Compute a hash
  const plaintext = new TextEncoder().encode(JSON.stringify(structure));
  const hashBuffer = await crypto.subtle.digest("SHA-1", plaintext);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString("16").padStart(2, "0"))
    .join("");

  // Put it in local storage
  window.localStorage.setItem("CARTS_FORM_HASH", hash);

  // Wait 35ms before proceeding, because the jsonpath cache is checking every
  // 30ms. This makes sure jsonpath can do its checks before anything starts to
  // try to use it.
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 35);
  });
};

export default setFormHash;
