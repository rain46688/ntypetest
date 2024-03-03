async function loading_test() {
  await new Promise(resolve => setTimeout(resolve, 1000))
}

export default async function asset_type() {
  await loading_test();

  return (
    <h2>asset_type</h2>
  )
}
