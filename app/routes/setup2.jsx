// app/routes/setup2.js
import React, { useState } from 'react';
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
} from '@shopify/polaris';
import { useNavigate } from '@remix-run/react';

const Setup2 = () => {
  const navigate = useNavigate();
  const [eSignatureEnabled, setESignatureEnabled] = useState(true);
  const [idUploadEnabled, setIdUploadEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailTrigger, setEmailTrigger] = useState('after_popup');

  const emailTriggerOptions = [
    { label: 'Before Checkout', value: 'before_checkout' },
    { label: 'After Age Verification', value: 'after_age_verification' },
    { label: 'After Popup Completion', value: 'after_popup' },
    { label: 'Manual Send', value: 'manual' },
  ];

  const selectedVerificationMethods = [
    eSignatureEnabled ? 'E-signature' : '',
    idUploadEnabled ? 'ID upload' : '',
  ]
    .filter(Boolean)
    .join(' and ') || 'None';

  const handleSave = async () => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        body: new URLSearchParams({
          eSignatureEnabled: eSignatureEnabled.toString(),
          idUploadEnabled: idUploadEnabled.toString(),
          emailEnabled: emailEnabled.toString(),
          emailTrigger,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Configuration saved successfully');
        navigate('/customers');
      } else {
        alert('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration');
    }
  };

  return (
    <Page
      backAction={{ content: 'Products', url: '#' }}
      title="Age Verification Setup"
      subtitle="Configure your age verification workflow in 2 simple steps"
      compactTitle
      primaryAction={{ content: 'Save Setup', onAction: handleSave }}
      secondaryActions={[
        {
          content: 'Duplicate',
          accessibilityLabel: 'Secondary action label',
          onAction: () => alert('Duplicate action'),
        },
        {
          content: 'View on your store',
          onAction: () => alert('View on your store action'),
        },
      ]}
      actionGroups={[
        {
          title: 'Promote',
          actions: [
            {
              content: 'Share on Facebook',
              accessibilityLabel: 'Individual action label',
              onAction: () => alert('Share on Facebook action'),
            },
          ],
        },
      ]}
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
      <Card title="Step 2: Verification Methods & Email Trigger" sectioned>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text variant="headingMd" as="h6" tone="strong">
              Step 2: Verification Methods & Email Trigger
            </Text>
            <Text as="p">Choose which verification methods to offer and configure email notifications.</Text>
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
              checked={eSignatureEnabled}
              onChange={setESignatureEnabled}
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
              checked={idUploadEnabled}
              onChange={setIdUploadEnabled}
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
              <Select
                options={emailTriggerOptions}
                value={emailTrigger}
                onChange={setEmailTrigger}
              />
            </BlockStack>
          </BlockStack>

          <Banner title="Setup Summary:" status="success" tone="success">
            <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
              <li>Verification methods: {selectedVerificationMethods}</li>
              <li>
                Email notifications:{' '}
                {emailEnabled
                  ? `Enabled (${emailTrigger.replace(/_/g, ' ')})`
                  : 'Disabled'}
              </li>
            </ul>
          </Banner>

          <InlineStack align="space-between" blockAlign="center">
            <Button onClick={() => navigate('/setup')}>Previous</Button>
            <Button primary onClick={handleSave}>
              Save Setup
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default Setup2;