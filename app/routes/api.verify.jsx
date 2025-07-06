import { json } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function action({ request }) {
  try {
    const body = await request.json();
    console.log('Received payload:', body); // Debug log
    const { firstName, lastName, streetAddress, city, zipCode, country } = body;

    // Basic validation
    if (!firstName || !lastName || !streetAddress || !city || !zipCode || !country) {
      return json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Store data in Prisma
    await prisma.userVerification.create({
      data: {
        firstName,
        lastName,
        streetAddress,
        city,
        zipCode,
        country,
      },
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error in /api/verify:', error);
    return json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}