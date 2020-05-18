export function roleIs(role: string, input: string): boolean {
  let result: boolean = false;
  if (input === role) {
    result = true;
  }
  return result;
}

// export function hasCredentials(roleIs: boolean): boolean {
//   let result: boolean = true;

//   return result;
// }