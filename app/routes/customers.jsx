// app/routes/customers.js
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
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import prisma from '../db.server';

export async function loader() {
  try {
    const verifications = await prisma.verification.findMany({
      select: {
        id: true,
        customer: true,
        orderDetails: true,
        verificationId: true,
        ageSubmitted: true,
        idType: true,
        status: true,
        verificationDate: true,
      },
    });
    return json({ verifications });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return json({ verifications: [] }, { status: 500 });
  }
}

export default function Customers() {
  const { verifications } = useLoaderData();
  const navigate = useNavigate();
  const [itemStrings, setItemStrings] = useState([
    'All',
    'Approved',
    'Pending',
    'Rejected',
  ]);

  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await new Promise((resolve) => setTimeout(resolve, 1));
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
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
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idxiland == index) {
                    return value;
                  }
                  return item.content;
                });
                await new Promise((resolve) => setTimeout(resolve, 1));
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: 'duplicate',
              onPrimaryAction: async (value) => {
                await new Promise((resolve) => setTimeout(resolve, 1));
                duplicateView(value);
                return true;
              },
            },
            {
              type: 'edit',
            },
            {
              type: 'delete',
              onPrimaryAction: async () => {
                await new Promise((resolve) => setTimeout(resolve, 1));
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  const [selected, setSelected] = useState(0);

  const onCreateNewView = async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };

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

  const [sortSelected, setSortSelected] = useState(['customer asc']);
  const { mode, setMode } = useSetIndexFiltersMode();

  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return true;
  };

  const primaryAction =
    selected === 0
      ? {
          type: 'save-as',
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: 'save',
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };

  const [statusFilter, setStatusFilter] = useState(undefined);
  const [ageRange, setAgeRange] = useState(undefined);
  const [taggedWith, setTaggedWith] = useState('');
  const [queryValue, setQueryValue] = useState('');

  const handleStatusFilterChange = useCallback(
    (value) => setStatusFilter(value),
    []
  );
  const handleAgeRangeChange = useCallback(
    (value) => setAgeRange(value),
    []
  );
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const handleStatusFilterRemove = useCallback(
    () => setStatusFilter(undefined),
    []
  );
  const handleAgeRangeRemove = useCallback(
    () => setAgeRange(undefined),
    []
  );
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
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

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
          selected={statusFilter || []}
          onChange={handleStatusFilterChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: 'ageRange',
      label: 'Age Submitted',
      filter: (
        <RangeSlider
          label="Age submitted is between"
          labelHidden
          value={ageRange || [18, 100]}
          output
          min={18}
          max={100}
          step={1}
          onChange={handleAgeRangeChange}
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (statusFilter && !isEmpty(statusFilter)) {
    appliedFilters.push({
      key: 'statusFilter',
      label: disambiguateLabel('statusFilter', statusFilter),
      onRemove: handleStatusFilterRemove,
    });
  }
  if (ageRange) {
    appliedFilters.push({
      key: 'ageRange',
      label: disambiguateLabel('ageRange', ageRange),
      onRemove: handleAgeRangeRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    appliedFilters.push({
      key: 'taggedWith',
      label: disambiguateLabel('taggedWith', taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const resourceName = {
    singular: 'verification',
    plural: 'verifications',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(verifications);

  const handleReview = useCallback(async (id) => {
    try {
      // Navigate to a review page or open a modal
      navigate(`/verifications/${id}/review`);
    } catch (error) {
      console.error('Error reviewing verification:', error);
      alert('Error reviewing verification');
    }
  }, [navigate]);

  const handleDownloadPDF = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/verifications/${id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `verification_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF');
    }
  }, []);

  const handleResend = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/verifications/${id}/resend`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Verification request resent');
      } else {
        alert('Failed to resend verification request');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      alert('Error resending verification');
    }
  }, []);

  const rowMarkup = verifications.map(
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
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {customer}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{orderDetails}</IndexTable.Cell>
        <IndexTable.Cell>{verificationId}</IndexTable.Cell>
        <IndexTable.Cell>{ageSubmitted}</IndexTable.Cell>
        <IndexTable.Cell>{idType}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge
            progress={
              status === 'Approved'
                ? 'complete'
                : status === 'Pending'
                ? 'partiallyComplete'
                : 'incomplete'
            }
          >
            {status}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{verificationDate}</IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'Pending' && (
              <Button size="micro" onClick={() => handleReview(id)}>
                Review
              </Button>
            )}
            <Button size="micro" onClick={() => handleDownloadPDF(id)}>
              Download PDF
            </Button>
            {status === 'Rejected' && (
              <Button size="micro" onClick={() => handleResend(id)}>
                Resend
              </Button>
            )}
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page
      backAction={{ content: 'Products', onAction: () => navigate('/app') }}
      title="Customer Verification Status"
      subtitle="Monitor and manage customer age verification submissions"
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
      <div style={{ width: '1000px', marginLeft: '-31px' }}>
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
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false,
            }}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView
            onCreateNewView={onCreateNewView}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            mode={mode}
            setMode={setMode}
          />
          <IndexTable
            condensed={useBreakpoints().smDown}
            resourceName={resourceName}
            itemCount={verifications.length}
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
  );

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
    } else {
      return value === '' || value == null;
    }
  }
}