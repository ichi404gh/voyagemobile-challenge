export function supressConsoleErrors(fn: () => void) {
  const err = console.error;
  console.error = jest.fn();
  fn();
  console.error = err;
}
