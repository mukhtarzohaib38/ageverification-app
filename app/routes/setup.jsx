// app/routes/setup.js
import React, { useState } from 'react';
import {
  Page,
  LegacyCard,
  FormLayout,
  Text,
  TextField,
  ChoiceList,
  InlineStack,
  BlockStack,
  Banner,
  Checkbox,
  Button,
  Layout,
  Select,
} from '@shopify/polaris';
import { useNavigate } from '@remix-run/react';

const Setup = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [popupTrigger, setPopupTrigger] = useState('checkout');
  const [minimumAge, setMinimumAge] = useState('18');

  const handleEnableToggle = () => setEnabled(!enabled);

  const options = [
    { label: 'On Checkout', value: 'checkout' },
    { label: 'On Page Load', value: 'pageload' },
    { label: 'On Cart View', value: 'addtocart' },
    { label: 'Manual Trigger', value: 'manual' },
  ];

  const getTriggerDescription = (trigger) => {
    switch (trigger) {
      case 'checkout':
        return 'when customers start checkout';
      case 'pageload':
        return 'on page load';
      case 'addtocart':
        return 'when customers add items to cart';
      case 'manual':
        return 'when you trigger it manually';
      default:
        return 'at an unspecified time';
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        body: new URLSearchParams({
          enabled: enabled.toString(),
          popupTrigger,
          minimumAge,
        }),
      });
      const result = await response.json();
      if (result.success) {
        navigate('/setup2');
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
      backAction={{ content: 'Products', onAction: () => navigate('/app') }}
      title="Age Verification Setup"
      subtitle="Configure your age verification workflow in 2 simple steps"
      compactTitle
      primaryAction={{ content: 'Save', disabled: true }}
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
      <LegacyCard title="Step 1: Popup Trigger Configuration" sectioned>
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              <InlineStack align="start">
                <Checkbox
                  label="Enable Age Verification Popup"
                  checked={enabled}
                  onChange={handleEnableToggle}
                />
              </InlineStack>

              <InlineStack gap="400">
                <BlockStack>
                  <Text variant="headingSm" as="h6">
                    When to Show Popup
                  </Text>
                  <Select
                    options={options}
                    onChange={setPopupTrigger}
                    value={popupTrigger}
                    disabled={!enabled}
                  />
                </BlockStack>

                <BlockStack>
                  <Text variant="headingSm" as="h6">
                    Minimum Age Required
                  </Text>
                  <TextField
                    type="number"
                    value={minimumAge}
                    onChange={setMinimumAge}
                    disabled={!enabled}
                  />
                </BlockStack>
              </InlineStack>

              <Banner status="info" title="Current Configuration">
                <p>
                  Age verification popup will appear <b>{getTriggerDescription(popupTrigger)}</b> and require customers to be at least <b>{minimumAge} years old</b>.
                </p>
              </Banner>
            </BlockStack>
          </Layout.Section>

          <Layout.Section>
            <InlineStack align="space-between">
              <Button disabled>Previous</Button>
              <Button onClick={handleNext} primary>
                Next
              </Button>
            </InlineStack>
          </Layout.Section>
        </Layout>
      </LegacyCard>
    </Page>
  );
};

export default Setup;