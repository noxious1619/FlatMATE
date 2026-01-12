async function searchAddress(query: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
  );
  return res.json();
}
export { searchAddress };