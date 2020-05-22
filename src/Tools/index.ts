
export function roleIs(role: string, input: string): boolean {
  let result: boolean = false;
  if (input === role) {
    result = true;
  }
  return result;
}