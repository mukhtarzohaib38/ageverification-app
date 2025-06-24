// app/routes/api.config.js
import { json } from '@remix-run/node';
import prisma from '../db.server';

export async function action({ request }) {
  const formData = await request.formData();
  const configData = {
    enabled: formData.get('enabled') === 'true',
    popupTrigger: formData.get('popupTrigger'),
    minimumAge: parseInt(formData.get('minimumAge')),
    eSignatureEnabled: formData.get('eSignatureEnabled') === 'true',
    idUploadEnabled: formData.get('idUploadEnabled') === 'true',
    emailEnabled: formData.get('emailEnabled') === 'true',
    emailTrigger: formData.get('emailTrigger'),
  };

  try {
    const config = await prisma.ageVerificationConfig.upsert({
      where: { id: 1 }, // Use a fixed ID or another unique identifier
      update: { ...configData, updatedAt: new Date() },
      create: { ...configData, id: 1 },
    });
    return json({ success: true, config }, { status: 200 });
  } catch (error) {
    console.error('Error saving config:', error);
    return json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}