export function formatTL(value) {
  return Number(value)
    .toFixed(2)                 // 2 ondalık
    .replace('.', ',')          // ondalık noktasını virgüle çevir
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}