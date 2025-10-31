export function Random(len: number) {
  const options = "gopicgsafdg3tey45367815634778";
  const length = options.length;

  let ans = "";
  for (let i = 0; i < len; i++) {
    ans += options[Math.floor(Math.random() * length)];
  }

  return ans;  
}
