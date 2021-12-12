/**
 * Check if the value is latitude
 *
 * @param {number} lat
 * @returns
 */
export function isLatitude(lat) {
  lat = Number(lat);
  return isFinite(lat) && Math.abs(lat) <= 90;
}

/**
 * Check if the value is longitude
 *
 * @param {number} lng
 * @returns
 */
export function isLongitude(lng) {
  lng = Number(lng);
  return isFinite(lng) && Math.abs(lng) <= 180;
}
