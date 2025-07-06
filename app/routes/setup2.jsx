import React, { useState, useCallback } from 'react';
import {
  Page,
  Card,
  BlockStack,
  Text,
  Checkbox,
  Select,
  Banner,
  Button,
  Divider,
  InlineStack,
  Toast,
  Frame,
  Icon,
  Tabs,
  Scrollable,
  Modal,
} from '@shopify/polaris';
import { useNavigate, useLoaderData } from '@remix-run/react';
import {
  EmailIcon,
  HomeIcon,
  PersonFilledIcon,
  SettingsIcon,
} from '@shopify/polaris-icons';

export async function loader() {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      return { config: null };
    }
    const config = await response.json();
    return { config };
  } catch (error) {
    console.error('Error fetching config:', error);
    return { config: null };
  }
}

const Setup2 = () => {
  const { config } = useLoaderData();
  const navigate = useNavigate();

  const [selectedVerificationMethod, setSelectedVerificationMethod] = useState(
    config?.eSignatureEnabled === 'true' ? 'eSignature' : config?.idUploadEnabled === 'true' ? 'idUpload' : 'eSignature'
  );
  const [emailEnabled, setEmailEnabled] = useState(config?.emailEnabled === 'true' || true);
  const [emailTrigger, setEmailTrigger] = useState(config?.emailTrigger || 'after_checkout');
  const [toastActive, setToastActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState(2);
  const [eSignatureTemplate, setESignatureTemplate] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Signature Email Template</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .signature-area { border: 2px dashed #ccc; height: 150px; text-align: center; padding: 20px; margin: 20px 0; position: relative; }
    .signature-area canvas { width: 100%; height: 100%; border: 1px solid #ccc; }
    .legal-declaration { background-color: #e6ffe6; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .email-verification { background-color: #e6f3ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .button { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
    .back-btn { background-color: #fff; color: #333; }
    .complete-btn { background-color: #d4e4d1; color: #333; }
    .clear-btn { background-color: #f0f0f0; color: #333; margin-left: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>E-Signature Verification</h2>
    <p>This shows how the e-signature step will appear to customers</p>
    <div class="signature-area">
      <p>Customer signs here with mouse or finger:</p>
      <canvas id="signatureCanvas" width="500" height="100"></canvas>
    </div>
    <div class="legal-declaration">
      <p>Legal Declaration: Customer confirms they are 18 years of age or older</p>
    </div>
    <div class="email-verification">
      <p>Email Verification: Verification email will be sent after e-signature completion</p>
    </div>
    <button class="button back-btn">Back</button>
    <button class="button complete-btn">Complete Verification</button>
    <button class="button clear-btn" onclick="clearCanvas()">Clear Signature</button>
  </div>

  <script>
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function getMousePos(event) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    }

    function getTouchPos(touchEvent) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (touchEvent.touches[0].clientX - rect.left) * scaleX,
        y: (touchEvent.touches[0].clientY - rect.top) * scaleY
      };
    }

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const pos = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (isDrawing) {
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    });

    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
      ctx.closePath();
    });

    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
      ctx.closePath();
    });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDrawing = true;
      const pos = getTouchPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (isDrawing) {
        const pos = getTouchPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    });

    canvas.addEventListener('touchend', () => {
      isDrawing = false;
      ctx.closePath();
    });
  </script>
</body>
</html>`);
  const [idUploadTemplate, setIdUploadTemplate] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ID Upload Email Template</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .upload-area { border: 2px dashed #ccc; height: 150px; text	P: center; padding: 20px; margin: 20px 0; }
    .legal-declaration { background-color: #e6ffe6; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .email-verification { background-color: #e6f3ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .button { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
    .back-btn { background-color: #fff; color: #333; }
    .complete-btn { background-color: #d4e4d1; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h2>ID Upload Verification</h2>
    <p>This shows how the ID upload step will appear to customers</p>
    <div class="upload-area">
      <p>Customer uploads ID here:</p>
      <p>Government-issued ID upload area</p>
      <input type="file" id="id-upload" name="id-upload" accept="image/*">
    </div>
    <div class="legal-declaration">
      <p>Legal Declaration: Customer confirms the provided ID is valid and belongs to them</p>
    </div>
    <div class="email-verification">
      <p>Email Verification: Verification email will be sent after ID upload completion</p>
    </div>
    <button class="button back-btn">Back</button>
    <button class="button complete-btn">Complete Verification</button>
  </div>
</body>
</html>`);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const emailTriggerOptions = [
    { label: 'After Checkout', value: 'after_checkout' },
  ];

  const selectedVerificationMethods =
    selectedVerificationMethod === 'eSignature' ? 'E-signature' : 'ID upload';

  const handleVerificationChange = (method) => {
    setSelectedVerificationMethod(method);
  };

  const toggleToastActive = useCallback(() => setToastActive((active) => !active), []);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        body: new URLSearchParams({
          eSignatureEnabled: (selectedVerificationMethod === 'eSignature').toString(),
          idUploadEnabled: (selectedVerificationMethod === 'idUpload').toString(),
          emailEnabled: emailEnabled.toString(),
          emailTrigger,
          setup: 'step2',
          eSignatureTemplate,
          idUploadTemplate,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setToastActive(true);
      } else {
        alert('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alertdistribute:( 'Error saving configuration');
    }
  };

  const handlePreview = (template) => {
    setPreviewContent(template);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewContent('');
  };

  const toastMarkup = toastActive ? (
    <Toast content="Configuration saved successfully" onDismiss={toggleToastActive} />
  ) : null;

  const tabs = [
    {
      id: 'dashboard',
      content: (
        <InlineStack gap="200" align="center">
          <Icon source={HomeIcon} />
          <Text as="span">Dashboard</Text>
        </InlineStack>
      ),
      accessibilityLabel: 'Dashboard',
    },
    {
      id: 'customers',
      content: (
        <InlineStack gap="200" align="center">
          <Icon source={PersonFilledIcon} />
          <Text as="span">Customers</Text>
        </InlineStack>
      ),
      accessibilityLabel: 'Customers',
    },
    {
      id: 'setup',
      content: (
        <InlineStack gap="200" align="center">
          <Icon source={SettingsIcon} />
          <Text as="span">Setup</Text>
        </InlineStack>
      ),
      accessibilityLabel: 'Setup',
    },
    {
      id: 'email-settings',
      content: (
        <InlineStack gap="200" align="center">
          <Icon source={EmailIcon} />
          <Text as="span">Email Settings</Text>
        </InlineStack>
      ),
      accessibilityLabel: 'Email Settings',
    },
  ];

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    const routes = {
      dashboard: '/app',
      customers: '/customers',
      setup: '/setup',
      'email-settings': '/emailsetting',
    };
    navigate(routes[tabs[selectedTabIndex].id]);
  };

  return (
    <Frame>
      <div style={{ marginBottom: '1rem' }}>
        <Tabs
          tabs={tabs}
          selected={selectedTab}
          onSelect={handleTabChange}
          fitted
        />
      </div>
      <Page
        title="Age Verification Setup"
        subtitle="Configure your age verification workflow in 2 simple steps"
      >
        <Card title="Step 2: Verification Methods & Email Trigger" sectioned>
          <BlockStack gap="400">
            <BlockStack gap="100">
              <Text variant="headingMd" as="h6" tone="strong">
                Step 2: Verification Methods & Email Trigger
              </Text>
              <Text as="p">
                Choose which verification methods to offer and configure email notifications.
              </Text>
            </BlockStack>

            <Divider />

            <BlockStack gap="200">
              <Text variant="headingMd" as="h6" tone="strong">
                Verification Methods
              </Text>

              <Checkbox
                label={
                  <>
                    <Text variant="bodySm" as="span" fontWeight="medium">
                      E-Signature Verification
                    </Text>{' '}
                    (Quick digital signature)
                  </>
                }
                checked={selectedVerificationMethod === 'eSignature'}
                onChange={() => handleVerificationChange('eSignature')}
              />

              <Checkbox
                label={
                  <>
                    <Text variant="bodySm" as="span" fontWeight="medium">
                      ID Upload Verification
                    </Text>{' '}
                    (Government-issued ID required)
                  </>
                }
                checked={selectedVerificationMethod === 'idUpload'}
                onChange={() => handleVerificationChange('idUpload')}
              />
            </BlockStack>

            <Divider />

            <BlockStack gap="200">
              <Checkbox
                label="Send Verification Emails"
                checked={emailEnabled}
                onChange={setEmailEnabled}
              />

              <BlockStack gap="100">
                <Text variant="bodyMd">Email Trigger</Text>
                <Select options={emailTriggerOptions} value={emailTrigger} onChange={setEmailTrigger} />
              </BlockStack>
            </BlockStack>

            <Banner title="Setup Summary:" status="success" tone="success">
              <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                <li>Verification methods: {selectedVerificationMethods}</li>
                <li>
                  Email notifications:{' '}
                  {emailEnabled ? `Enabled (${emailTrigger.replace(/_/g, ' ')})` : 'Disabled'}
                </li>
              </ul>
            </Banner>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
                <Text variant="headingMd" as="h6">
                  Preview E-Signature Template (HTML)
                </Text>
                <Scrollable style={{ maxHeight: '300px', overflow: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <textarea
                      value={eSignatureTemplate}
                      onChange={(e) => setESignatureTemplate(e.target.value)}
                      rows={10}
                      autoComplete="off"
                      style={{
                        width: '100%',
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
                <div style={{marginTop:"10px"}}>
                <Button onClick={() => handlePreview(eSignatureTemplate)}>Preview E-Signature</Button>
                </div>
              </div>
              <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
                <Text variant="headingMd" as="h6">
                  Preview ID Upload Template (HTML)
                </Text>
                <Scrollable style={{ maxHeight: '300px', overflow: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <textarea
                      value={idUploadTemplate}
                      onChange={(e) => setIdUploadTemplate(e.target.value)}
                      rows={10}
                      autoComplete="off"
                      style={{
                        width: '100%',
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
                <div style={{marginTop:"10px"}}>
                <Button onClick={() => handlePreview(idUploadTemplate)}>Preview ID Upload</Button>
                </div>
              </div>
            </div>

            <InlineStack align="space-between" blockAlign="center">
              <Button onClick={() => navigate('/setup')}>Previous</Button>
              <Button primary onClick={handleSave}>
                Save Setup
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {toastMarkup}
      
        <Modal

          open={previewOpen}
          onClose={handlePreviewClose}
          title="Template Preview"
          size="large"
        >
          <Modal.Section>
            <iframe
              srcDoc={previewContent}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title="Template Preview"
            />
          </Modal.Section>
        </Modal>
      </Page>
    </Frame>
  );
};

export default Setup2;