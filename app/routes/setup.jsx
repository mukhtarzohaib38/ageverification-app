import React, { useState, useEffect } from 'react';
import {
  Page,
  LegacyCard,
  Text,
  TextField,
  InlineStack,
  BlockStack,
  Banner,
  Checkbox,
  Button,
  Layout,
  Select,
  Icon,
  Tabs,
  Frame,
  FormLayout,
  Modal,
  Card,
  Link,
  Spinner
} from '@shopify/polaris';
import { useNavigate, useLoaderData } from '@remix-run/react';
import {
  ArrowLeftIcon,
  EmailIcon,
  HomeIcon,
  PersonFilledIcon,
  PlanIcon,
  SettingsIcon,
  ShieldCheckMarkIcon,
  ViewIcon,
  CheckIcon
} from '@shopify/polaris-icons';

// Loader function to fetch saved configuration
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

// Age Entry Modal Component
const AgeEntryModal = ({
  isAgeEntryOpen,
  handleClosePreview,
  popupTitle = 'Age Verification',
  primaryColor = '#007bff',
  handleAgeSubmit,
  minimumAge,
}) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const isValidDateFormat = () => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    return (
      !isNaN(d) && !isNaN(m) && !isNaN(y) &&
      d >= 1 && d <= 31 &&
      m >= 1 && m <= 12 &&
      y >= 1900 && y <= new Date().getFullYear()
    );
  };

  return (
    <Modal
      open={isAgeEntryOpen}
      onClose={handleClosePreview}
      title={popupTitle}
    >
      <Modal.Section>
        <BlockStack gap="400" align="center">
          <div style={{ textAlign: 'center' }}>
            <Text  variant="heading3xl" as="h2">
              Age Verification
            </Text>
          </div>
          <InlineStack align="center" gap="100">
            <Text variant="bodySm" tone="subdued">PowerBanner by</Text>
            <div style={{ width: '20px' }}>
              <Icon source={ShieldCheckMarkIcon} color="base" />
            </div>
            <Text variant="bodySm" tone="subdued">AgeChecker.Net</Text>
          </InlineStack>
          <Text variant="headingMd" as="h2" fontWeight="bold" style={{ textAlign: 'center' }}>
            Enter your date of birth:
          </Text>
          <InlineStack gap="100" align="center">
            <TextField
              label="Day"
              placeholder="DD"
              value={day}
              onChange={setDay}
              maxLength={2}
              autoComplete="off"
            />
            <TextField
              label="Month"
              placeholder="MM"
              value={month}
              onChange={setMonth}
              maxLength={2}
              autoComplete="off"
            />
            <TextField
              label="Year"
              placeholder="YYYY"
              value={year}
              onChange={setYear}
              maxLength={4}
              autoComplete="off"
            />
          </InlineStack>
          <div style={{ textAlign: 'center' }}>
            <Text variant="bodyMd" as="p" fontWeight="semibold">
              Note: Your date of birth must be accurate! If it isn't, we will be unable to verify your age.
            </Text>
          </div>
          <InlineStack gap="400" align="center" wrap>
            <Link url="mailto:help@agechecker.net" external>
              <Text variant="bodyXs" tone="subdued">help@agechecker.net</Text>
            </Link>
            <Link url="tel:888-276-2303" external>
              <Text variant="bodyXs" tone="subdued">888-276-2303</Text>
            </Link>
            <Link url="#privacy-policy" external>
              <Text variant="bodyXs" tone="subdued">Privacy Policy</Text>
            </Link>
            <Link url="#terms-of-service" external>
              <Text variant="bodyXs" tone="subdued">Terms of Service</Text>
            </Link>
            <Link url="#learn-more" external>
              <Text variant="bodyXs" tone="subdued">Learn More</Text>
            </Link>
          </InlineStack>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

// Verification Success Modal Component

const Setup = () => {
  const { config } = useLoaderData();
  const navigate = useNavigate();

  // Initialize state with saved config or default values
  const [enabled, setEnabled] = useState(config?.enabled === 'true' || false);
  const [popupTrigger, setPopupTrigger] = useState(config?.popupTrigger || 'checkout');
  const [minimumAge, setMinimumAge] = useState(config?.minimumAge || '18');
  const [selectedTab, setSelectedTab] = useState(2);
  const [popupTitle, setPopupTitle] = useState(config?.popupTitle || 'Age Verification');
  const [popupDescription, setPopupDescription] = useState(config?.popupDescription || 'We must verify your age.');
  const [buttonText, setButtonText] = useState(config?.buttonText || 'Continue');
  const [primaryColor, setPrimaryColor] = useState(config?.primaryColor || '#2ecc71');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAgeEntryOpen, setIsAgeEntryOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isVerifiedOpen, setIsVerifiedOpen] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState(null); // Added error state
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (config) {
      setEnabled(config.enabled === 'true' || false);
      setPopupTrigger(config.popupTrigger || 'checkout');
      setMinimumAge(config.minimumAge || '18');
      setPopupTitle(config.popupTitle || 'Age Verification');
      setPopupDescription(config.popupDescription || 'We must verify your age.');
      setButtonText(config.buttonText || 'Verify Age');
      setPrimaryColor(config.primaryColor || '#2ecc71');
      setLogoUrl(config.logoUrl || '');
    }
  }, [config]);

  const handleEnableToggle = () => setEnabled(!enabled);
  const handleOpenPreview = () => setIsPreviewOpen(true);
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setIsAgeEntryOpen(false);
    setIsPersonalInfoOpen(false);
    setIsVerifiedOpen(false);
    setError(null); // Clear error on close
    setDay('');
    setMonth('');
    setYear('');
    setFirstName('');
    setLastName('');
    setStreetAddress('');
    setCity('');
    setZipCode('');
    setCountry('');
  };
  const handleCloseVerified = () => {
    setIsVerifiedOpen(false);
    setIsPersonalInfoOpen(false);
    setIsAgeEntryOpen(false);
    setIsPreviewOpen(false);
    setError(null); // Clear error on close
    setDay('');
    setMonth('');
    setYear('');
    setFirstName('');
    setLastName('');
    setStreetAddress('');
    setCity('');
    setZipCode('');
    setCountry('');
  };
  const handleOpenAgeEntry = () => {
    setIsPreviewOpen(false);
    setIsAgeEntryOpen(true);
  };
  const handleAgeSubmit = ({ day, month, year }) => {
    const dateString = `${day}/${month}/${year}`;
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      setError('Please enter a valid date in DD/MM/YYYY format.');
       setShowContinue(true); // show Continue button
      return;
    }
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age >= parseInt(minimumAge, 10)) {
      handleOpenPersonalInfo();
    } else {
      setError(`You must be at least ${minimumAge} years old.`);
    }
  };
  const handleOpenPersonalInfo = () => {
    setIsAgeEntryOpen(false);
    setIsPersonalInfoOpen(true);
  };

  const handlePersonalInfoSubmit = async () => {
  // setError(null); // Clear previous errors
  // if (!firstName || !lastName || !streetAddress || !city || !zipCode || !country) {
  //   setError('Please fill out all required fields.');
  //   return;
  // }
  // try {
  //   console.log('Sending request to /api/verify with data:', {
  //     firstName,
  //     lastName,
  //     streetAddress,
  //     city,
  //     zipCode,
  //     country,
  //   });
  //   const response = await fetch('/api/verify', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       firstName,
  //       lastName,
  //       streetAddress,
  //       city,
  //       zipCode,
  //       country,
  //     }),
  //   });
  //   console.log('Response status:', response.status);
  //   const result = await response.json();
  //   console.log('Response data:', result);
  //   if (!response.ok) {
  //     throw new Error(result.message || `HTTP error! status: ${response.status}`);
  //   }
    // if (result.success) {
      setIsPersonalInfoOpen(false);
      setIsVerifiedOpen(true);
  //   } else {
  //     setError('Verification failed: ' + (result.message || 'Unknown error'));
  //   }
  // } catch (error) {
  //   console.error('Error submitting personal info:', error);
  //   setError('Error submitting personal info: ' + error.message);
  // }
};

  const options = [
    { label: 'On Checkout', value: 'checkout' },
    { label: 'On Page Load', value: 'pageload' },
  ];

  const countryOptions = [
    { label: 'Select country...', value: '' },
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
  ];

  const getTriggerDescription = (trigger) => {
    switch (trigger) {
      case 'checkout':
        return 'when customers start checkout';
      case 'pageload':
        return 'on page load';
      default:
        return 'at an unspecified time';
    }
  };

 const handleNext = async () => {
  // Validation checks
  // if (!['checkout', 'pageload'].includes(popupTrigger)) {
  //   setError('Invalid popup trigger selected.');
  //   return;
  // }
  // if (!minimumAge || isNaN(minimumAge) || Number(minimumAge) < 1) {
  //   setError('Please enter a valid minimum age.');
  //   return;
  // }

  // try {
    // // Create URL-encoded form data
    // const formData = new URLSearchParams();
    // formData.append('enabled', enabled.toString());
    // formData.append('popupTrigger', popupTrigger);
    // formData.append('minimumAge', minimumAge);
    // formData.append('popupTitle', popupTitle);
    // formData.append('popupDescription', popupDescription);
    // formData.append('buttonText', buttonText);
    // formData.append('primaryColor', primaryColor);
    // formData.append('logoUrl', logoUrl);
    // formData.append('setup', 'step1');

    // const response = await fetch('/api/config', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: formData.toString(),
    // });

    // const result = await response.json();
    // if (result.success) {
      navigate('/setup2');
  //   } else {
  //     setError('Failed to save configuration');
  //   }
  // } catch (error) {
  //   console.error('Error saving config:', error);
  //   setError('Error saving configuration');
  //  }
};

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

  //
   const isValidDateFormat = () => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    return (
      !isNaN(d) &&
      !isNaN(m) &&
      !isNaN(y) &&
      d >= 1 &&
      d <= 31 &&
      m >= 1 &&
      m <= 12 &&
      y >= 1900 &&
      y <= new Date().getFullYear()
    );
  };
  //footer
  // Common footer links component to avoid repetition
  const FooterLinks = () => (
    <div
      style={{
        backgroundColor: '#f9fafb',
        padding: '1rem',
        marginLeft: '-13px',
        width: '607px',
        overflowX: 'auto',
        borderRadius: '6px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.8rem',
          whiteSpace: 'nowrap',
          flexWrap: 'nowrap',
          paddingBottom: '0.3rem',
        }}
      >
        {[
          { href: 'mailto:help@agechecker.net', text: 'help@agechecker.net' },
          { href: 'tel:888-276-2303', text: '888-276-2303' },
          { href: '#privacy-policy', text: 'Privacy Policy' },
          { href: '#terms-of-service', text: 'Terms of Service' },
          { href: '#learn-more', text: 'Learn More' },
        ].map((link) => (
          <a
            key={link.text}
            href={link.href}
            style={{
              color: primaryColor, // Use primaryColor for footer links
              fontSize: '0.875rem',
              textDecoration: 'none',
              fontWeight: '500',
              flexShrink: 0,
            }}
          >
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );

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
        fullWidth
        title="Age Verification Setup"
        subtitle="Configure your age verification workflow in 2 simple steps"
      >
        <Layout>
          <Layout.Section>
            <LegacyCard title="Step 1: Popup Trigger Configuration" sectioned>
              <BlockStack gap="400">
                <p>Configure when and how the age verification popup appears to customers.</p>
                {error && (
                  <Banner status="critical" title="Error">
                    <p>{error}</p>
                  </Banner>
                )}
                <Checkbox
                  label="Enable Age Verification Popup"
                  checked={enabled}
                  onChange={handleEnableToggle}
                />

                <InlineStack gap="400" wrap>
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
                      min={1}
                    />
                  </BlockStack>
                </InlineStack>

                <Banner status="info" title="Current Configuration">
                  <p>
                    Age verification popup will appear <b>{getTriggerDescription(popupTrigger)}</b> and require customers to be at least <b>{minimumAge} years old</b>.
                  </p>
                </Banner>

                <Text variant="headingSm" as="h6">
                  Popup Design Settings
                </Text>
                <p>Customize the appearance and branding of your age verification popup.</p>

                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      label="Popup Title"
                      value={popupTitle}
                      onChange={setPopupTitle}
                      disabled={!enabled}
                    />
                    <TextField
                      label="Button Text"
                      value={buttonText}
                      onChange={setButtonText}
                      disabled={!enabled}
                    />
                  </FormLayout.Group>
                </FormLayout>

                <BlockStack>
                  <TextField
                    label="Popup Description"
                    value={popupDescription}
                    onChange={setPopupDescription}
                    disabled={!enabled}
                  />
                </BlockStack>

                <InlineStack gap="400" wrap={false}>
                  <BlockStack>
                    <Text variant="headingSm" as="h6">
                      Primary Color
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <label htmlFor="colorPicker" style={{ display: 'none' }}>Primary Color</label>
                      <input
                        id="colorPicker"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        disabled={!enabled}
                        style={{
                          width: '40px',
                          height: '30px',
                          padding: '0',
                          border: 'none',
                          cursor: enabled ? 'pointer' : 'not-allowed',
                        }}
                      />
                      <TextField
                        value={primaryColor}
                        onChange={setPrimaryColor}
                        disabled={!enabled}
                        autoComplete="off"
                      />
                    </div>
                  </BlockStack>
                  
                </InlineStack>

           
                 
              <div style={{ textAlign: 'left' }}>
  <Button icon={ViewIcon} onClick={handleOpenPreview} disabled={!enabled}>
    Preview Popup
  </Button>
</div>

              

                <InlineStack align="space-between">
                  <Button disabled>Previous</Button>
                  <Button onClick={handleNext} primary>
                    Next
                  </Button>
                </InlineStack>
              </BlockStack>
            </LegacyCard>
          </Layout.Section>
        </Layout>

        {/* First Modal: Age Verification Prompt */}
     
      {/* First Modal: Age Verification Prompt */}
<Modal open={isPreviewOpen} onClose={handleClosePreview} title="" primaryAction={null}>
  <Modal.Section>
    <BlockStack gap="400" align="center">
      <div style={{ textAlign: 'center' }}>
        <Text variant="heading3xl" as="h2" fontWeight="regular">
          {popupTitle}
        </Text>
      </div>
      <div style={{ marginTop: '-12px', textAlign: 'center', marginLeft: '-29px' }}>
        <Text variant="headingMd" as="h6" fontWeight="regular">
          Powered by <span style={{ fontWeight: 500, color: '#777' }}>AgeChecker.Net</span>
        </Text>
      </div>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'center',
          maxWidth: '520px',
          color: '#333',
          lineHeight: '1.6',
          fontSize: '14px',
          marginLeft: '31px',
        }}
      >
        <div style={{ marginBottom: '7px' }}>
          <Text variant="headingLg" as="h5" fontWeight="medium">
            {popupDescription}
          </Text>
        </div>
        <Text>
          Age verification is required by the FDA and state regulations. Customers are verified instantly. Your information will only be used to verify your age.
        </Text>
      </div>
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleOpenAgeEntry}
          style={{
            backgroundColor: primaryColor,
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '12px 48px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            marginTop: '-11px',
          }}
        >
          {buttonText} ➔
        </button>
      </div>
      <FooterLinks primaryColor={primaryColor} />
    </BlockStack>
  </Modal.Section>
</Modal>

{/* Second Modal: Enter Date of Birth */}
<Modal
  open={isAgeEntryOpen}
  onClose={handleClosePreview}
  title=""
  primaryAction={{
    content: 'Next',
    onAction: () => handleAgeSubmit({ day, month, year }),
    disabled: !isValidDateFormat(),
    style: {
      backgroundColor: primaryColor,
      color: '#ffffff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
    },
  }}
  secondaryActions={[{ content: 'Close', onAction: handleClosePreview }]}
>
  <Modal.Section>
    <BlockStack gap="400" align="center">
      <InlineStack align="start" gap="100">
        <div style={{ width: '20px' }}>
          <Icon source={ArrowLeftIcon} color="base" />
        </div>
        <Text variant="bodyLg">Back</Text>
      </InlineStack>
      <div style={{ textAlign: 'center' }}>
        <Text variant="heading3xl" as="h2" fontWeight="regular">
          {popupTitle}
        </Text>
      </div>
      <div style={{ marginTop: '-12px', textAlign: 'center', marginLeft: '-29px' }}>
        <Text variant="headingMd" as="h6" fontWeight="regular">
          Powered by <span style={{ fontWeight: 500, color: '#777' }}>AgeChecker.Net</span>
        </Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text variant="headingLg" as="h5" fontWeight="regular">
          Enter your date of birth:
        </Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
        <input
          type="text"
          maxLength={2}
          placeholder="DD"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={{
            border: 'none',
            borderBottom: `2px solid ${primaryColor}`,
            outline: 'none',
            fontSize: '28px',
            width: '48px',
            textAlign: 'center',
            color: '#94A3B8',
          }}
        />
        <span style={{ fontSize: '28px' }}>/</span>
        <input
          type="text"
          maxLength={2}
          placeholder="MM"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{
            border: 'none',
            borderBottom: `2px solid ${primaryColor}`,
            outline: 'none',
            fontSize: '28px',
            width: '48px',
            textAlign: 'center',
            color: '#94A3B8',
          }}
        />
        <span style={{ fontSize: '28px' }}>/</span>
        <input
          type="text"
          maxLength={4}
          placeholder="YYYY"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{
            border: 'none',
            borderBottom: `2px solid ${primaryColor}`,
            outline: 'none',
            fontSize: '24px',
            width: '72px',
            textAlign: 'center',
            color: '#94A3B8',
          }}
        />
      </div>
      <Text variant="headingMd" as="h6" fontWeight="regular" alignment="center">
        <strong>Note:</strong> Your date of birth must be accurate! If it isn't, we will be unable to verify your age.
      </Text>
      <FooterLinks primaryColor={primaryColor} />
    </BlockStack>
  </Modal.Section>
</Modal>

{/* Third Modal: Personal Information Form */}
<Modal
  open={isPersonalInfoOpen}
  onClose={handleClosePreview}
  title=""
  primaryAction={{
    content: 'Submit',
    onAction: handlePersonalInfoSubmit,
    disabled: !firstName || !lastName || !streetAddress || !city || !zipCode || !country,
    style: {
      backgroundColor: primaryColor,
      color: '#ffffff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '4px',
    },
  }}
  secondaryActions={[{ content: 'Close', onAction: handleClosePreview }]}
>
  <Modal.Section>
    <BlockStack gap="400" align="center">
      <InlineStack align="start" gap="100">
        <div style={{ width: '20px' }}>
          <Icon source={ArrowLeftIcon} color="base" />
        </div>
        <Text variant="bodyLg">Back</Text>
      </InlineStack>
      <div style={{ textAlign: 'center' }}>
        <Text variant="heading3xl" as="h2" fontWeight="regular">
          {popupTitle}
        </Text>
      </div>
      <div style={{ marginTop: '-12px', textAlign: 'center', marginLeft: '-29px' }}>
        <Text variant="headingMd" as="h6" fontWeight="regular">
          Powered by <span style={{ fontWeight: 500, color: '#777' }}>AgeChecker.Net</span>
        </Text>
      </div>
      {error && (
        <Banner status="critical" title="Error">
          <p>{error}</p>
        </Banner>
      )}
      <div>
        <Text variant="headingLg" as="h2" fontWeight="regular">
          Please enter your personal information.
        </Text>
        <Text variant="bodyMd" as="p" tone="subdued" alignment="center">
          This information will be used to verify your identity.
        </Text>
      </div>
      <div style={{ display: 'flex', gap: '20px',}}>
        <div>
          <label style={{ color: 'red' }}>
            First Name: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            style={{ padding: '8px', margin: '5px 0', width: '200px' }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div>
          <label style={{ color: 'red' }}>
            Last Name: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            style={{ padding: '8px', margin: '5px 0', width: '200px' }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
       
        </div>
         
      </div>
     
     <p style={{ color: '#6b6b6b', fontSize: '13px', fontFamily: 'Arial, sans-serif', margin: 0 ,marginLeft:'76px'}}>
  Enter your legal name as it appears on your ID. Do not include titles or nicknames.
</p>

     
      <div style={{ marginBottom: '10px' }}>
        <label style={{ color: 'red' }}>
          Street Address: <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          style={{ padding: '8px', margin: '5px 0', width: '420px' }}
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          placeholder="Enter the first line of your home address."
          autoComplete="street-address"
        />
        <div style={{marginLeft:'96px'}}>
        <Text variant="bodyMd" as="p" tone="subdued">
          Enter the first line of your home address
        </Text>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
        <div>
          <label style={{ color: 'red' }}>
            City: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            style={{ padding: '8px', margin: '5px 0', width: '200px' }}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label style={{ color: 'red' }}>
            ZIP / Postal Code: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            style={{ padding: '8px', margin: '5px 0', width: '200px' }}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            autoComplete="postal-code"
          />
        </div>
      </div>
      <div>
        <label style={{ color: 'red' }}>
          Country: <span style={{ color: 'red' }}>*</span>
        </label>
        <select
          style={{ padding: '8px', margin: '5px 0', width: '220px' }}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <FooterLinks primaryColor={primaryColor} />
    </BlockStack>
  </Modal.Section>
</Modal>

{/* Fourth Modal: Verification Success */}
<Modal
  open={isVerifiedOpen}
  onClose={handleCloseVerified}
  title=""
  primaryAction={{
    content: (
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        Continue <Spinner accessibilityLabel="Loading" size="small" />
      </span>
    ),
    onAction: handleCloseVerified,
    style: {
      backgroundColor: primaryColor,
      color: '#ffffff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      fontSize: '18px',
      justifyContent: 'center',
    },
  }}
  secondaryActions={[]}
>
  <Modal.Section>
    <BlockStack gap="400" align="center">
      <div style={{ textAlign: 'center' }}>
        <Text variant="heading3xl" as="h2" fontWeight="regular">
          {popupTitle}
        </Text>
      </div>
      <div style={{ marginTop: '-12px', textAlign: 'center', marginLeft: '-29px' }}>
        <Text variant="headingMd" as="h6" fontWeight="regular">
          Powered by <span style={{ fontWeight: 500, color: '#777' }}>AgeChecker.Net</span>
        </Text>
      </div>
      <Text variant="headingLg" fontWeight="semibold">
        Verified!
      </Text>
      <Text variant="bodyMd" alignment="center">
        You may now proceed with your order.
      </Text>
      <Text variant="bodyMd" alignment="center">
        Your age was successfully verified, thank you for your patience.
      </Text>
      <div style={{ margin: '30px 0' }}>
        <Icon source={CheckIcon} color="success" tone="base" />
      </div>
      <FooterLinks primaryColor={primaryColor} />
    </BlockStack>
  </Modal.Section>
</Modal>
      </Page>
    </Frame>
  );
};

export default Setup;