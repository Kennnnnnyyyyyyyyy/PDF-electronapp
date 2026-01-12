import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Annotation } from '../types';

export async function exportPdf(
    fileBuffer: ArrayBuffer,
    annotations: Annotation[]
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    for (const ann of annotations) {
        if (ann.pageIndex < 0 || ann.pageIndex >= pages.length) continue;
        const page = pages[ann.pageIndex];

        if (ann.type === 'text' && ann.text) {
            const fontSize = ann.fontSizePt || 12;
            page.drawText(ann.text, {
                x: ann.xPt,
                y: ann.yPt - fontSize,
                size: fontSize,
                font: helveticaFont,
                color: rgb(0, 0, 0),
            });
        }

        if (ann.type === 'ink' && ann.strokes) {
            for (const stroke of ann.strokes) {
                if (stroke.length < 2) continue;

                // Construct SVG Path Data from PDF points
                // Since points are already in PDF coordinates, we don't need scaling or flipping here,
                // assuming drawSvgPath works in User Space.
                const pathData = stroke.map((p, i) =>
                    `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`
                ).join(' ');

                page.drawSvgPath(pathData, {
                    x: 0,
                    y: 0,
                    borderColor: rgb(1, 0, 0), // Default Red for now
                    borderWidth: ann.thicknessPt || 2,
                });
            }
        }
    }

    return pdfDoc.save();
}
