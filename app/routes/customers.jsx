import {
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
  useBreakpoints,
  Button,
  ButtonGroup,
  Page,
  Tabs,
  Frame,
  InlineStack,
  Icon,

} from '@shopify/polaris';
import {
  EmailIcon,
  HomeIcon,
  PersonFilledIcon,
  SettingsIcon,
} from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Loader function to fetch verification data
export async function loader() {
  const verifications = [
    {
      id: '1001',
      customer: 'Jaydon Stanton',
      orderDetails: '#1020',
      verificationId: 'VER-2025-001',
      ageSubmitted: 25,
      idType: 'Email Signature',
      status: 'Approved',
      verificationDate: '2025-07-20',
    },
    {
      id: '1002',
      customer: 'Ruben Westerfelt',
      orderDetails: '#1019',
      verificationId: 'VER-2025-002',
      ageSubmitted: 30,
      idType: 'Upload ID',
      status: 'Pending',
      verificationDate: '2025-07-19',
    },
    {
      id: '1003',
      customer: 'Leo Carder',
      orderDetails: '#1018',
      verificationId: 'VER-2025-003',
      ageSubmitted: 22,
      idType: 'Upload ID',
      status: 'Rejected',
      verificationDate: '2025-07-18',
    },
  ];

  return json({ verifications });
}

export default function Customers() {
  const { verifications } = useLoaderData();
  const navigate = useNavigate();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // State for tabs and filters
  const [itemStrings, setItemStrings] = useState([
    'All',
    'Approved',
    'Pending',
    'Rejected',
  ]);
  const [selected, setSelected] = useState(0);
  const [sortSelected, setSortSelected] = useState(['customer asc']);
  const [statusFilter, setStatusFilter] = useState([]);
  const [ageRange, setAgeRange] = useState([18, 100]);
  const [taggedWith, setTaggedWith] = useState('');
  const [queryValue, setQueryValue] = useState('');
  const { mode, setMode } = useSetIndexFiltersMode();

  // Tab management
  const deleteView = useCallback((index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  }, [itemStrings]);

  const duplicateView = useCallback(async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  }, [itemStrings]);

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => setSelected(index),
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: 'rename',
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((tab, idx) =>
                  idx === index ? value : tab.content
                );
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: 'duplicate',
              onPrimaryAction: async (value) => {
                await sleep(1);
                await duplicateView(value);
                return true;
              },
            },
            {
              type: 'delete',
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  const onCreateNewView = useCallback(async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  }, [itemStrings]);

  // Sort options
  const sortOptions = [
    { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
    { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
    { label: 'Verification ID', value: 'verificationId asc', directionLabel: 'Ascending' },
    { label: 'Verification ID', value: 'verificationId desc', directionLabel: 'Descending' },
    { label: 'Age Submitted', value: 'ageSubmitted asc', directionLabel: 'Ascending' },
    { label: 'Age Submitted', value: 'ageSubmitted desc', directionLabel: 'Descending' },
    { label: 'Verification Date', value: 'verificationDate asc', directionLabel: 'Ascending' },
    { label: 'Verification Date', value: 'verificationDate desc', directionLabel: 'Descending' },
  ];

  // Filter handlers
  const handleStatusFilterChange = useCallback((value) => setStatusFilter(value), []);
  const handleAgeRangeChange = useCallback((value) => setAgeRange(value), []);
  const handleTaggedWithChange = useCallback((value) => setTaggedWith(value), []);
  const handleFiltersQueryChange = useCallback((value) => setQueryValue(value), []);
  const handleStatusFilterRemove = useCallback(() => setStatusFilter([]), []);
  const handleAgeRangeRemove = useCallback(() => setAgeRange([18, 100]), []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);

  const handleFiltersClearAll = useCallback(() => {
    handleStatusFilterRemove();
    handleAgeRangeRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleStatusFilterRemove,
    handleAgeRangeRemove,
    handleTaggedWithRemove,
    handleQueryValueRemove,
  ]);

  const onHandleCancel = useCallback(() => {}, []);
  const onHandleSave = useCallback(async () => {
    await sleep(1);
    return true;
  }, []);

 const primaryAction = {
    type: selected === 0 ? 'save-as' : 'save',
    content: selected === 0 ? 'Save As' : 'Save', // Explicitly set button text
    onAction: selected === 0 ? onCreateNewView : onHandleSave,
    disabled: false,
    loading: false,
  };
  // Filter definitions
 const filters = [
  {
    key: 'statusFilter',
    label: 'Status',
    filter: (
      <ChoiceList
        title="Status"
        titleHidden
        choices={[
          { label: 'Approved', value: 'approved' },
          { label: 'Pending', value: 'pending' },
          { label: 'Rejected', value: 'rejected' },
        ]}
        selected={statusFilter}
        onChange={handleStatusFilterChange}
        allowMultiple
      />
    ),
    shortcut: true,
  },
];


  // Applied filters for display
  const appliedFilters = [];
  if (statusFilter.length > 0) {
    appliedFilters.push({
      key: 'statusFilter',
      label: disambiguateLabel('statusFilter', statusFilter),
      onRemove: handleStatusFilterRemove,
    });
  }
  if (ageRange[0] !== 18 || ageRange[1] !== 100) {
    appliedFilters.push({
      key: 'ageRange',
      label: disambiguateLabel('ageRange', ageRange),
      onRemove: handleAgeRangeRemove,
    });
  }
  if (taggedWith !== '') {
    appliedFilters.push({
      key: 'taggedWith',
      label: disambiguateLabel('taggedWith', taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  // Filter and sort verifications
  const filteredVerifications = verifications
    .filter((verification) => {
      const tabStatus = itemStrings[selected].toLowerCase();
      const statusMatch =
        tabStatus === 'all' ||
        (statusFilter.length === 0 && verification.status.toLowerCase() === tabStatus) ||
        statusFilter.includes(verification.status.toLowerCase());

      const ageMatch =
        verification.ageSubmitted >= ageRange[0] && verification.ageSubmitted <= ageRange[1];

      const taggedMatch = taggedWith
        ? verification.orderDetails.toLowerCase().includes(taggedWith.toLowerCase()) ||
          verification.customer.toLowerCase().includes(taggedWith.toLowerCase())
        : true;

      const queryMatch = queryValue
        ? verification.customer.toLowerCase().includes(queryValue.toLowerCase()) ||
          verification.orderDetails.toLowerCase().includes(queryValue.toLowerCase()) ||
          verification.verificationId.toLowerCase().includes(queryValue.toLowerCase())
        : true;

      return statusMatch && ageMatch && taggedMatch && queryMatch;
    })
    .sort((a, b) => {
      const [field, direction] = sortSelected[0].split(' ');
      const isAsc = direction === 'asc';
      if (field === 'customer') {
        return isAsc
          ? a.customer.localeCompare(b.customer)
          : b.customer.localeCompare(a.customer);
      } else if (field === 'verificationId') {
        return isAsc
          ? a.verificationId.localeCompare(b.verificationId)
          : b.verificationId.localeCompare(a.verificationId);
      } else if (field === 'ageSubmitted') {
        return isAsc
          ? a.ageSubmitted - b.ageSubmitted
          : b.ageSubmitted - a.ageSubmitted;
      } else if (field === 'verificationDate') {
        return isAsc
          ? new Date(a.verificationDate) - new Date(b.verificationDate)
          : new Date(b.verificationDate) - new Date(a.verificationDate);
      }
      return 0;
    });

  // Resource state for table selection
  const resourceName = {
    singular: 'verification',
    plural: 'verifications',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(filteredVerifications);

  // Action handlers
  
  const handleResend = useCallback((id) => {
    console.log(`Resending verification ID: ${id}`);
    // Implement resend logic here (e.g., API call to resend verification)
  }, []);

const handleDownloadPDF = useCallback((id) => {
  console.log(`Generating PDF for verification ID: ${id}`);

  // Find the verification data for the given ID
  const verification = filteredVerifications.find((item) => item.id === id);
  if (!verification) return;

  // Initialize jsPDF
  const doc = new jsPDF();

  // Set document title
  doc.setFontSize(20);
  doc.text('AgeGuard Pro', 105, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text('Age Verification Report', 105, 30, { align: 'center' });
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35); // Horizontal line

  // Customer Information
  doc.setFontSize(12);
  doc.text('Customer Information', 20, 50);
  doc.text(`Name: ${verification.customer}`, 20, 60);
  doc.text(`Email: ${verification.email || 'john@example.com'}`, 80, 60);
  doc.text(`Age Submitted: ${verification.ageSubmitted} ${verification.ageSubmitted === 1 ? 'year' : 'years'}`, 20, 70);
  doc.text(`ID Type: ${verification.idType}`, 80, 70);
  doc.line(20, 75, 190, 75); // Horizontal line for separation

  // Order Details
  doc.text('Order Details', 20, 90);
  const orderId = verification.orderDetails.split('#')[1] || 'N/A';
  doc.text(`Order ID: #${orderId}`, 20, 100);
  doc.text(`Order Date: ${new Date(verification.verificationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}`, 80, 100);
  doc.line(20, 105, 190, 105); // Horizontal line for separation

  // Verification Details
  doc.text('Verification Details', 20, 120);
  doc.text(`Verification ID: ${verification.verificationId}`, 20, 130);
  doc.text(`Status: ${verification.status}`, 20, 140);
  doc.text(`Verification Date: ${new Date(verification.verificationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}`, 80, 140);
  doc.line(20, 145, 190, 145); // Horizontal line for separation

  // Footer with dynamic date and time
  let lastY = 150;
  doc.setFontSize(10);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi',
  }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+) (\w+)/, '$1/$2/$3 at $4 $5');
  const footerText = `This report was generated on ${formattedDate} AgeGuard Pro - Shopify Age Verification System`;
  const footerY = lastY + 10;
  doc.text(footerText, 20, footerY);

  // Convert PDF to data URL and open in new tab
  const pdfDataUri = doc.output('datauristring');
  const newTab = window.open();
  if (newTab) {
    newTab.document.write(`
      <html>
        <body style="margin: 0; padding: 0;">
          <embed width="100%" height="100%" src="${pdfDataUri}" type="application/pdf">
        </body>
      </html>
    `);
  } else {
    console.error('Failed to open new tab. Please allow popups.');
  }
}, [filteredVerifications]);

  // Update rowMarkup to display age with "year" or "years"
 const rowMarkup = filteredVerifications.map(
  (
    {
      id,
      customer,
      orderDetails,
      verificationId,
      ageSubmitted,
      idType,
      status,
      verificationDate,
    },
    index
  ) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>{customer}</IndexTable.Cell>
      <IndexTable.Cell>{orderDetails}</IndexTable.Cell>
      <IndexTable.Cell>{verificationId}</IndexTable.Cell>
      <IndexTable.Cell>
        {(() => {
          const verificationDt = new Date(verificationDate);
          const birthYear = verificationDt.getFullYear() - ageSubmitted;
          const birthDate = new Date(
            birthYear,
            verificationDt.getMonth(),
            verificationDt.getDate()
          );
          const formattedDOB = birthDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }); // e.g., "12 Mar 1974"
          return `${formattedDOB} = ${ageSubmitted} ${ageSubmitted === 1 ? 'year' : 'years'}`;
        })()}
      </IndexTable.Cell>
      <IndexTable.Cell>{idType}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge
          tone={
            status === 'Approved'
              ? 'success'
              : status === 'Pending'
              ? 'attention'
              : 'critical'
          }
        >
          {status}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {status === 'Pending'
          ? 'Not Verified'
          : new Date(verificationDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          {status !== 'Pending' && (
            <Button size="micro" onClick={() => handleDownloadPDF(id)}>
              Download PDF
            </Button>
          )}
          {(status === 'Rejected' || status === 'Pending') && (
            <Button size="micro" onClick={() => handleResend(id)}>
              Resend
            </Button>
          )}
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  )
);
  const cancelAction = {
  content: 'Cancel',
  onAction: onHandleCancel,
  disabled: false,
  loading: false,
};

//

 const [selectedTab, setSelectedTab] = useState(1);
   const tabss = [
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
 
   const handleTabChanges = (selectedTabIndex) => {
     setSelectedTab(selectedTabIndex);
     // Navigate based on tab id
     const routes = {
       dashboard: '/app',
       customers: '/customers',
       setup: '/setup',
       'email-settings': '/emailsetting',
     };
     navigate(routes[tabs[selectedTabIndex].id]);
   };

   //deletebutton logic
   
  return (
   <Frame>
     <div style={{marginTop:'10px',marginBottom:"2px"  }}>
            <Tabs
              tabs={tabss}
              selected={selectedTab}
              onSelect={handleTabChanges}
              fitted
            />
          </div>
    <Page

      title="Customer Verification Status"
      subtitle="Monitor and manage customer age verification submissions"
    >
      <div style={{ width: '970px', marginLeft: '-1px' }}>
        <LegacyCard>
         <IndexFilters
  sortOptions={sortOptions}
  sortSelected={sortSelected}
  queryValue={queryValue}
  queryPlaceholder="Searching in all"
  onQueryChange={handleFiltersQueryChange}
  onQueryClear={() => setQueryValue('')}
  onSort={setSortSelected}
  primaryAction={primaryAction}
  cancelAction={cancelAction}
  tabs={tabs}
  selected={selected}
  onSelect={setSelected}
  canCreateNewView={false}
  filters={filters}
  onClearAll={handleFiltersClearAll}
  mode={mode}
  setMode={setMode}
/>
          <IndexTable
            condensed={useBreakpoints().smDown}
            resourceName={resourceName}
            itemCount={filteredVerifications.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: 'Customer' },
              { title: 'Order Details' },
              { title: 'Verification ID' },
              { title: 'Age Submitted' },
              { title: 'ID Type' },
              { title: 'Status' },
              { title: 'Verification Date' },
              { title: 'Actions' },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      </div>
    </Page>
    </Frame>
  );

  // Helper functions
  function disambiguateLabel(key, value) {
    switch (key) {
      case 'ageRange':
        return `Age submitted is between ${value[0]} and ${value[1]}`;
      case 'taggedWith':
        return `Tagged with ${value}`;
      case 'statusFilter':
        return value.map((val) => `Status ${val}`).join(', ');
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === '' || value == null;
  }
}