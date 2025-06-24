// app/routes/api.verifications.$id.review.js
import { json } from '@remix-run/node';
import prisma from '../db.server';

export async function action({ params }) {
  const { id } = params;
  try {
    // Logic to mark a verification for review
    const verification = await prisma.verification.update({
      where: { id },
      data: { status: 'Under Review' },
    });
    return json({ success: true, verification });
  } catch (error) {
    console.error('Error reviewing verification:', error);
    return json({ error: 'Failed to review verification' }, { status: 500 });
  }
}