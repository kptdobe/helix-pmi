export default function decorate(block) {
  const cols = block.querySelectorAll(':scope > div > div');
  if (cols) {
    cols.forEach((col) => {
      col.style.width = `${Math.round(100 / cols.length)}%`;
    });
  }
}
