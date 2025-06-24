// app/routes/api.verifications.$id.pdf.js
import { json } from '@remix-run/node';
import prisma from '../db.server';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export async function loader({ params }) {
  const { id } = params;
  try {
    const verification = await prisma.verification.findUnique({
      where: { id },
    });
    if (!verification) {
      return json({ error: 'Verification not found' }, { status: 404 });
    }

    const doc = new PDFDocument();
    const stream = new PassThrough();
    doc.pipe(stream);
    doc.text(`Verification ID: ${verification.verificationId}`);
    doc.text(`Customer: ${verification.customer}`);
    doc.text(`Age Submitted: ${verification.ageSubmitted}`);
    doc.text(`ID Type: ${verification.idType}`);
    doc.text(`Status: ${verification.status}`);
    doc.text(`Verification Date: ${verification.verificationDate}`);
    doc.end();

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=verification_${id}.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}