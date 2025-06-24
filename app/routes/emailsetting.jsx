import { useState, useCallback, useEffect } from 'react';
import {
  Page,
  LegacyCard,
  Tabs,
  TextField,
  TextContainer,
  Button,
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  Card,
  Badge,
  Scrollable,
  Toast,
} from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';
import { useNavigate, useLoaderData, useActionData, useSubmit } from '@remix-run/react';
import { json } from '@remix-run/node';
import prisma from '../db.server';

export const loader = async () => {
  try {
    const settings = await prisma.emailTemplateSetting.findMany();
    return json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return json({ settings: [], error: 'Failed to fetch settings' }, { status: 500 });
  }
};

export default function EmailSetting() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() || { settings: [] }; // Default to empty object to prevent null error
  const { settings: initialSettings } = loaderData;
  const actionData = useActionData();
  const submit = useSubmit();
  const [selected, setSelected] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState(false);
  const [files, setFiles] = useState([]);

  const [settings, setSettings] = useState({
    verification: {
      subject: 'Age Verification Required - Upload Your ID',
      preview: 'Complete your order by verifying your age',
      body: `<!DOCTYPE html>
<html>
<head>
    <title>Age Verification Required</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #3b82f6;">Age Verification Required</h1>
    </div>
    
    <p>Hello {{customer_name}},</p>
    
    <p>Thank you for your recent order <strong>{{order_number}}</strong>. To complete your purchase, we need to verify your age as required by law for age-restricted products.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>What you need to do:</h3>
        <ol>
            <li>Click the verification link below</li>
            <li>Upload a clear photo of your government-issued ID</li>
            <li>Wait for verification (usually within 24 hours)</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{verification_link}}" style="background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px;">
            Verify Your Age
        </a>
      </div>
      
      <p><strong>Important:</strong> Your ID information is processed securely and deleted after verification.</p>
      
      <p>If you have any questions, please contact our support team.</p>
      
      <p>Best regards,<br>{{store_name}} Team</p>
</body>
</html>`,
    },
    success: {
      subject: 'Age Verification Successful',
      preview: 'Your age has been verified and your order is now being processed',
      body: `<!DOCTYPE html>
<html>
<head>
    <title>Age Verification Successful</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #10b981;">Age Verification Successful!</h1>
    </div>
    
    <p>Hello {{customer_name}},</p>
    
    <p>Great news! Your age verification has been successfully completed for order <strong>{{order_number}}</strong>.</p>
    
    <div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #10b981; margin-top: 0;">✓ Verification Complete</h3>
        <p style="margin-bottom: 0;">Your order is now being processed and will be shipped according to our standard delivery times.</p>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong> {{order_number}}</p>
        <p><strong>Verification Date:</strong> {{verification_date}}</p>
        <p><strong>Status:</strong> Verified & Processing</p>
    </div>
    
    <p>You can track your order status at any time by visiting your account or using the tracking information we'll send separately.</p>
    
    <p>Thank you for your business!</p>
    
    <p>Best regards,<br>{{store_name}} Team</p>
</body>
</html>`,
    },
    reject: {
      subject: 'Age Verification Rejected',
      preview: 'We need clearer documentation to complete your age verification',
      body: `<!DOCTYPE html>
<html>
<head>
    <title>Age Verification - Try Again</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f59e0b;">Age Verification - Action Required</h1>
    </div>
    
    <p>Hello {{customer_name}},</p>
    
    <p>We've reviewed the documentation you submitted for order <strong>{{order_number}}</strong>, but we need additional information to complete your age verification.</p>
    
    <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e; margin-top: 0;">Why was my verification declined?</h3>
        <p style="margin-bottom: 10px;"><strong>Reason:</strong> {{rejection_reason}}</p>
        <p style="margin-bottom: 0;">Common issues include unclear photos, expired documents, or missing information.</p>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>What to do next:</h3>
        <ol>
            <li>Take a new, clear photo of your government-issued ID</li>
            <li>Ensure all text is readable and the document is not expired</li>
            <li>Make sure the entire document is visible in the photo</li>
            <li>Submit your new documentation using the link below</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{retry_verification_link}}" style="background-color: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Try Verification Again
        </a>
    </div>
    
    <p><strong>Need Help?</strong> If you continue to have issues, please contact our support team with your order number.</p>
    
    <p>We appreciate your patience as we work to complete your order.</p>
    
    <p>Best regards,<br>{{store_name}} Team</p>
</body>
</html>`,
    },
    upload: {
      note: '',
      description: '',
      instructions: '',
      privacyNote: '',
      maxFileSize: '',
    },
  });

  // Initialize settings from loader data
  useEffect(() => {
    if (initialSettings?.length > 0) {
      const loadedSettings = {
        verification: {},
        success: {},
        reject: {},
        upload: {},
      };
      initialSettings.forEach((s) => {
        loadedSettings[s.type] = {
          subject: s.subject || '',
          preview: s.preview || '',
          body: s.body || '',
          note: s.note || '',
          description: s.description || '',
          instructions: s.instructions || '',
          privacyNote: s.privacyNote || '',
          maxFileSize: s.maxFileSize || '',
        };
      });
      setSettings(loadedSettings);
    }
  }, [initialSettings]);

  // Handle action response for user feedback
  useEffect(() => {
    if (actionData) {
      setToastMessage(actionData.message || (actionData.success ? 'Settings saved successfully' : 'Failed to save settings'));
      setToastError(!actionData.success);
      setShowToast(true);
    }
  }, [actionData]);

  const toggleToast = useCallback(() => setShowToast(false), []);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !files.length && (
    <DropZone.FileUpload actionHint="Max 5mb, Accepts .gif, .jpg, and .png" />
  );

  const uploadedFiles = files.length > 0 && (
    <LegacyStack vertical>
      {files.map((file, index) => (
        <LegacyStack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              validImageTypes.includes(file.type)
                ? window.URL.createObjectURL(file)
                : NoteIcon
            }
          />
          <div>
            {file.name}{' '}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div>
        </LegacyStack>
      ))}
    </LegacyStack>
  );

  const saveSettingsToServer = () => {
    const emailSettings = [];
    ['verification', 'success', 'reject', 'upload'].forEach((type) => {
      const setting = { type, ...settings[type] };
      emailSettings.push(setting);
    });

    const formData = new FormData();
    formData.append('settings', JSON.stringify(emailSettings));
    submit(formData, { method: 'post', action: '/api.email-settings' });
  };

  const tabVariables = {
    verification: [
      { key: '{{customer_name}}', description: 'Customer full name' },
      { key: '{{customer_email}}', description: 'Customer email address' },
      { key: '{{order_number}}', description: 'Order ID/number' },
      { key: '{{verification_link}}', description: 'Link to upload ID' },
      { key: '{{retry_verification_link}}', description: 'Link to retry verification' },
      { key: '{{store_name}}', description: 'Your store name' },
      { key: '{{store_url}}', description: 'Your store URL' },
    ],
    success: [
      { key: '{{customer_name}}', description: 'Customer full name' },
      { key: '{{order_number}}', description: 'Order ID/number' },
      { key: '{{store_name}}', description: 'Your store name' },
      { key: '{{verification_date}}', description: 'Date of verification' },
    ],
    reject: [
      { key: '{{customer_name}}', description: 'Customer full name' },
      { key: '{{order_number}}', description: 'Order ID/number' },
      { key: '{{retry_verification_link}}', description: 'Link to retry verification' },
      { key: '{{store_name}}', description: 'Your store name' },
      { key: '{{rejection_reason}}', description: 'Reason for rejection' },
    ],
    upload: [],
  };

  const tabs = [
    {
      id: 'verification-email',
      content: 'Verification Email',
      panelID: 'verification-email-content',
      type: 'email',
      stateKey: 'verification',
      subjectLabel: 'Email Subject',
      bodyLabel: 'Email Template (HTML)',
      placeholder: 'Age Verification Required - Upload Your ID',
    },
    {
      id: 'success-email',
      content: 'Success Email',
      panelID: 'success-email-content',
      type: 'email',
      stateKey: 'success',
      subjectLabel: 'Success Email Subject',
      bodyLabel: 'Email Template (HTML)',
      placeholder: 'Age Verification Successful',
    },
    {
      id: 'reject-email',
      content: 'Reject Email',
      panelID: 'reject-email-content',
      type: 'email',
      stateKey: 'reject',
      subjectLabel: 'Reject Email Subject',
      bodyLabel: 'Email Template (HTML)',
      placeholder: 'Age Verification Rejected',
    },
    {
      id: 'upload-pages',
      content: 'Upload Pages',
      panelID: 'upload-pages-content',
      type: 'note',
      stateKey: 'upload',
      noteLabel: 'Note for Upload Page',
      placeholder: '',
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
  }, []);

  const handleInputChange = useCallback((value, stateKey, field) => {
    setSettings((prev) => ({
      ...prev,
      [stateKey]: {
        ...prev[stateKey],
        [field]: value,
      },
    }));
  }, []);

  const renderTabContent = () => {
    const currentTab = tabs[selected];
    const variables = tabVariables[currentTab.stateKey];

    if (currentTab.type === 'email') {
      return (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <TextContainer>
              <TextField
                label={
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>
                    {currentTab.subjectLabel}
                  </span>
                }
                value={settings[currentTab.stateKey].subject}
                onChange={(value) => handleInputChange(value, currentTab.stateKey, 'subject')}
                autoComplete="off"
                placeholder={currentTab.placeholder}
              />
            </TextContainer>
            <TextContainer>
              <TextField
                label={
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>
                    Preview Text
                  </span>
                }
                value={settings[currentTab.stateKey].preview}
                onChange={(value) => handleInputChange(value, currentTab.stateKey, 'preview')}
                autoComplete="off"
                placeholder="e.g., A short summary of the email shown in inbox"
              />
            </TextContainer>
            <br />
            <Text variant="headingMd" as="h6">
              Email Template (HTML)
            </Text>
            <Scrollable style={{ maxHeight: '300px', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <textarea
                  value={settings[currentTab.stateKey].body}
                  onChange={(e) => handleInputChange(e.target.value, currentTab.stateKey, 'body')}
                  rows={10}
                  autoComplete="off"
                  style={{
                    width: '434px',
                    height: '300px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </Scrollable>
            <br />
            <Button onClick={saveSettingsToServer} primary>
              Save All Settings
            </Button>
          </div>
          <div style={{ flex: 1, background: '#f9fafb', padding: '16px' }}>
            <Text as="p" fontWeight="semibold">
              Available Variables
            </Text>
            <br />
            {variables.length > 0 ? (
              variables.map((varItem) => (
                <div key={varItem.key} style={{ marginBottom: '12px' }}>
                  <TextContainer>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{varItem.key}</p>
                    <p style={{ margin: 0, color: '#6b7280' }}>{varItem.description}</p>
                  </TextContainer>
                </div>
              ))
            ) : (
              <p>No variables available for this tab.</p>
            )}
            <div style={{ marginTop: '24px', gap: '12px' }}>
              <div>
                <Button outline>Preview Email</Button>
              </div>
              <div style={{ marginTop: '12px' }}>
                <Button primary>Send Email</Button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (currentTab.type === 'note') {
      return (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <TextField
              label={
                <span style={{ fontWeight: '600', fontSize: '14px' }}>Page Title</span>
              }
              value={settings[currentTab.stateKey].note}
              onChange={(value) => handleInputChange(value, currentTab.stateKey, 'note')}
              placeholder="Upload Your ID for Age Verification"
              autoComplete="off"
            />
            <TextContainer>
              <TextField
                label={
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Description</span>
                }
                value={settings[currentTab.stateKey].description || ''}
                onChange={(value) => handleInputChange(value, currentTab.stateKey, 'description')}
                placeholder="Please upload a clear photo of your government-issued ID to complete your order verification."
                multiline={4}
                autoComplete="off"
              />
            </TextContainer>
            <TextContainer>
              <TextField
                label={
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>
                    Upload Instructions
                  </span>
                }
                value={settings[currentTab.stateKey].instructions || ''}
                onChange={(value) => handleInputChange(value, currentTab.stateKey, 'instructions')}
                placeholder="Ensure your ID is clearly visible and all information is readable."
                multiline={4}
                autoComplete="off"
              />
            </TextContainer>
            <TextContainer>
              <TextField
                label={
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Privacy Note</span>
                }
                value={settings[currentTab.stateKey].privacyNote || ''}
                onChange={(value) => handleInputChange(value, currentTab.stateKey, 'privacyNote')}
                placeholder="Your ID will be securely processed and deleted after verification."
                multiline={3}
                autoComplete="off"
              />
            </TextContainer>
            <LegacyStack alignment="center" distribution="equalSpacing" wrap={false}>
              <TextField
                label={
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>
                    Max File Size (MB)
                  </span>
                }
                value={settings[currentTab.stateKey].maxFileSize || ''}
                onChange={(value) => handleInputChange(value, currentTab.stateKey, 'maxFileSize')}
                placeholder="5"
                type="number"
                autoComplete="off"
              />
            </LegacyStack>
            <div style={{ marginLeft: '206px', marginTop: '-36px' }}>
              <Text variant="headingMd" as="h6">
                Accepted Formats
              </Text>
              <p>JPG, JPEG, PNG, PDF</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Button primary icon="save" onClick={saveSettingsToServer}>
                Save All Settings
              </Button>
            </div>
          </div>
          <div style={{ flex: 1, background: '#f9fafb', padding: '16px' }}>
            <Text variant="headingXs" as="h6">
              Upload Page Preview
            </Text>
            <div style={{ marginTop: '10px' }} />
            <Card>
              <div style={{ marginTop: '10px' }} />
              <Text variant="headingMd" as="h6">
                Upload Your ID for Age Verification
              </Text>
              <p>Please upload a clear photo of your government-issued ID to complete your order verification.</p>
              <div style={{ marginTop: '10px' }} />
              <DropZone onDrop={handleDropZoneDrop} variableHeight>
                {uploadedFiles}
                {fileUpload}
              </DropZone>
            </Card>
            <div style={{ marginTop: '10px' }}>
              <Badge tone="info">Ensure your ID is clearly visible and all information is readable.</Badge>
            </div>
            <div style={{ marginTop: '10px' }}>
              <p>Your ID will be securely processed and deleted after verification.</p>
            </div>
          </div>
        </div>
      );
    }

    return <p>Tab not found</p>;
  };

  return (
    <Page
      backAction={{ content: 'Products', onAction: () => navigate('/app') }}
      title="Email Templates & Settings"
      subtitle="Customize your verification emails and ID upload page"
      compactTitle
    >
      {showToast && (
        <Toast
          content={toastMessage}
          error={toastError}
          onDismiss={toggleToast}
        />
      )}
      <LegacyCard>
        <Tabs
          tabs={tabs}
          selected={selected}
          onSelect={handleTabChange}
          disclosureText="More views"
          fitted
        >
          <LegacyCard.Section title={tabs[selected].content}>
            {renderTabContent()}
          </LegacyCard.Section>
        </Tabs>
      </LegacyCard>
    </Page>
  );
}