// app/routes/api.verifications.$id.resend.js
import { json } from '@remix-run/node';
import prisma from '../db.server';

export async function action({ params }) {
  const { id } = params;
  try {
    const verification = await prisma.verification.update({
      where: { id },
      data: { status: 'Pending' }, // Reset status to pending
    });
    // Add logic to send email (e.g., using a service like SendGrid)
    return json({ success: true });
  } catch (error) {
    console.error('Error resending verification:', error);
    return json({ error: 'Failed to resend verification' }, { status: 500 });
  }
}