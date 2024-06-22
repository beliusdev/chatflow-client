export function getErrorMessage(error) {
  return error?.response?.data?.message;
}
