export type AnnotationType = 'text' | 'ink';

export interface Point {
    x: number;
    y: number;
}

export interface Annotation {
    id: string;
    type: AnnotationType;
    pageIndex: number;

    // PDF Point Coordinates (Origins may vary, but typically bottom-left in PDF, 
    // however PDF.js viewport converts top-left based. We need to be careful. 
    // User spec: "xPt, yPt (PDF points, origin bottom-left)"
    // BUT PDF.js viewport.convertToPdfPoint converts from Viewport (top-left) to PDF (bottom-left).
    // So we store PDF points.)
    xPt: number;
    yPt: number;

    // Text specific
    text?: string;
    widthPt?: number;
    heightPt?: number;
    fontSizePt?: number;

    // Ink specific
    strokes?: Point[][]; // Array of strokes, each stroke is array of points
    color?: string;
    thicknessPt?: number;
}
