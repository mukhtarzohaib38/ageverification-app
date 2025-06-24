import { json } from '@remix-run/node';
import prisma from '~/db.server';

export const loader = async () => {
  try {
    const settings = await prisma.emailTemplateSetting.findMany();
    return json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return json({ settings: [], error: 'Failed to fetch settings' }, { status: 500 });
  }
};

export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const settings = JSON.parse(formData.get('settings'));

    // Use upsert to update existing settings or create new ones
    const savePromises = settings.map((setting) =>
      prisma.emailTemplateSetting.upsert({
        where: { type: setting.type },
        update: {
          subject: setting.subject || null,
          preview: setting.preview || null,
          body: setting.body || null,
          note: setting.note || null,
          description: setting.description || null,
          instructions: setting.instructions || null,
          privacyNote: setting.privacyNote || null,
          maxFileSize: setting.maxFileSize || null,
          updatedAt: new Date(),
        },
        create: {
          type: setting.type,
          subject: setting.subject || null,
          preview: setting.preview || null,
          body: setting.body || null,
          note: setting.note || null,
          description: setting.description || null,
          instructions: setting.instructions || null,
          privacyNote: setting.privacyNote || null,
          maxFileSize: setting.maxFileSize || null,
        },
      })
    );

    await Promise.all(savePromises);

    return json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    return json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
};