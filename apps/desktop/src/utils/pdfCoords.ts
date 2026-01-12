import { PageViewport } from 'pdfjs-dist';

// User spec:
// Store annotation positions ONLY in PDF coordinates (points)
// viewport.convertToViewportPoint(xPt, yPt) → (xPx, yPx)
// viewport.convertToPdfPoint(xPx, yPx) → (xPt, yPt)

// PDF.js Viewport usually has (0,0) at top-left.
// PDF file usually has (0,0) at bottom-left.
// viewport.convertToPdfPoint handles this flip if separate coordinate systems are used, 
// BUT we must trust PDF.js to know the PDF's internal coordinate system.

/**
 * Converts Screen/Viewport Pixels (relative to the page container) to PDF Points.
 */
export function viewportToPdf(
    xPx: number,
    yPx: number,
    viewport: PageViewport
): [number, number] {
    return viewport.convertToPdfPoint(xPx, yPx) as [number, number];
}

/**
 * Converts PDF Points to Screen/Viewport Pixels (relative to the page container).
 */
export function pdfToViewport(
    xPt: number,
    yPt: number,
    viewport: PageViewport
): [number, number] {
    return viewport.convertToViewportPoint(xPt, yPt) as [number, number];
}

/**
 * Converts a length/size from Viewport Pixels to PDF Points.
 * Not position, just scalar magnitude.
 */
export function scalarToPdf(
    lengthPx: number,
    viewport: PageViewport
): number {
    // Scale is roughly viewport.scale (pixels per point)
    // But viewport.scale might include CSS transform.
    // Generally: Pt = Px / viewport.scale
    // But let's use the transform matrix to be safe if possible?
    // viewport.scale is the reliable factor for default 72dpi point.
    return lengthPx / viewport.scale;
}

/**
 * Converts a length/size from PDF Points to Viewport Pixels.
 */
export function scalarToViewport(
    lengthPt: number,
    viewport: PageViewport
): number {
    return lengthPt * viewport.scale;
}
