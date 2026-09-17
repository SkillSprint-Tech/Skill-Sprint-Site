/**
 * Where the attendee's name goes on the page. Dependency-free on purpose: the server uses it
 * to draw the PDF and the admin panel uses it for the live preview, so both agree.
 *
 * style.x, style.y  baseline centre, as fractions of the page measured from the top-left
 * style.size        font size, in the same units as pageWidth / pageHeight
 * style.maxWidth    widest the name may be, as a fraction of the page width; longer names are
 *                   scaled down rather than wrapped
 * measure(t, size)  rendered width of `t` at `size`
 *
 * Returns { size, width, x, y } in PDF convention: x is the left edge of the text, y is the
 * baseline measured from the BOTTOM of the page.
 */
export function layoutName({ name, style, pageWidth, pageHeight, measure }) {
  const limit = style.maxWidth * pageWidth
  let size = style.size
  let width = measure(name, size)

  if (width > limit && width > 0) {
    size = (size * limit) / width
    width = measure(name, size)
  }

  return {
    size,
    width,
    x: style.x * pageWidth - width / 2,
    y: pageHeight - style.y * pageHeight,
  }
}
