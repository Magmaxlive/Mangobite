export const ROWS = [
  { label: 'Top Sellers',        keywords: ['kesar', 'banganapalli', 'alphonso'] },
  { label: 'Customer Favorites', keywords: ['himayat', 'mallika', 'langda', 'dasheri', 'rajapuri', 'chaunsa'] },
  { label: 'Popular Picks',      keywords: ['sindhuri', 'totapuri', 'chinna rasallu', 'pedda rasallu', 'cheruku rasalu'] },
  // { label: 'More Varieties',     keywords: ['payri', 'malgova', 'tella gulabeelu', 'avakai', 'himasagar', 'lakshman bhog', 'rajnath'] },
]

function getProductRank(product) {
  const title = product.title.toLowerCase()
  for (let row = 0; row < ROWS.length; row++) {
    for (let col = 0; col < ROWS[row].keywords.length; col++) {
      if (title.includes(ROWS[row].keywords[col])) {
        return row * 1000 + col
      }
    }
  }
  return 9999
}

export function sortProductsByCategory(products) {
  return [...products].sort((a, b) => getProductRank(a) - getProductRank(b))
}

export function groupProductsByCategory(products) {
  const groups = ROWS.map(row => ({ label: row.label, products: [] }))
  const others = []

  for (const product of products) {
    const title = product.title.toLowerCase()
    let placed = false
    for (let r = 0; r < ROWS.length; r++) {
      for (let c = 0; c < ROWS[r].keywords.length; c++) {
        if (title.includes(ROWS[r].keywords[c])) {
          groups[r].products.push(product)
          placed = true
          break
        }
      }
      if (placed) break
    }
    if (!placed) others.push(product)
  }

  const result = groups.filter(g => g.products.length > 0)
  if (others.length > 0) result.push({ label: 'more vareites', products: others })
  return result
}
