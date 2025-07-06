import { json } from '@remix-run/node';
import prisma from '../db.server';

export async function loader() {
  try {
    const config = await prisma.ageVerificationConfig.findUnique({
      where: { id: 1 }, // Match the ID used in upsert
    });

    if (!config) {
      console.warn('Loader: No configuration found for id: 1');
      return json({ config: null }, { status: 200 });
    }

    console.log('Loader: Fetched config:', config); // Debug log
    return json({ config }, { status: 200 });
  } catch (error) {
    console.error('Loader: Error fetching config:', error);
    return json({ config: null, error: error.message }, { status: 500 });
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const setup = formData.get('setup');

  if (!setup || !['step1', 'step2'].includes(setup)) {
    return json({ error: 'Invalid or missing setup parameter' }, { status: 400 });
  }

  let configData;

  if (setup === 'step1') {
    const enabled = formData.get('enabled') === 'true';
    const popupTrigger = formData.get('popupTrigger');
    const minimumAge = parseInt(formData.get('minimumAge'));

    // Validation
    if (!['checkout', 'pageload'].includes(popupTrigger)) {
      return json({ error: 'Invalid popupTrigger value' }, { status: 400 });
    }
    if (isNaN(minimumAge) || minimumAge < 1) {
      return json({ error: 'Invalid minimumAge value' }, { status: 400 });
    }

    configData = {
      enabled,
      popupTrigger,
      minimumAge,
    };
  } else {
    const eSignatureEnabled = formData.get('eSignatureEnabled') === 'true';
    const idUploadEnabled = formData.get('idUploadEnabled') === 'true';
    const emailEnabled = formData.get('emailEnabled') === 'true';
    const emailTrigger = formData.get('emailTrigger');

    // Validation
    if (!['after_checkout'].includes(emailTrigger)) {
      return json({ error: 'Invalid emailTrigger value' }, { status: 400 });
    }
    if (!eSignatureEnabled && !idUploadEnabled) {
      return json({ error: 'At least one verification method must be enabled' }, { status: 400 });
    }

    configData = {
      eSignatureEnabled,
      idUploadEnabled,
      emailEnabled,
      emailTrigger,
    };
  }

  try {
    const config = await prisma.ageVerificationConfig.upsert({
      where: { id: 1 }, // Use a fixed ID
      update: { ...configData, updatedAt: new Date() },
      create: { ...configData, id: 1, createdAt: new Date() },
    });

    console.log('Action: Saved config:', config); // Debug log
    return json({ success: true, config }, { status: 200 });
  } catch (error) {
    console.error('Action: Error saving config:', error);
    return json({ error: `Failed to save configuration: ${error.message}` }, { status: 500 });
  }
}