// app/routes/index.jsx
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  LegacyCard,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Grid,
  Badge,
  Divider,
  Icon,
  Frame,
  Tabs,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  ShieldCheckMarkIcon,
  EmailIcon,
  HomeIcon,
  PersonFilledIcon,
  SettingsIcon,
  ClipboardCheckIcon,
  AlertTriangleIcon,
  ArrowDiagonalIcon,
} from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import  prisma from "../db.server";

// Loader to fetch popupTrigger from the database
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  // Fetch the age verification config from the database
  const config = await prisma.ageVerificationConfig.findUnique({
    where: { id: 1 }, // Assuming ID 1 is used as per your api.config.js
    select: { popupTrigger: true },
  });

  return json({ popupTrigger: config?.popupTrigger || "On checkout" }); // Fallback to "On checkout" if no config
};

// Action remains unchanged
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    }
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    }
  );
  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  });
};

export default function Index() {
  const { popupTrigger } = useLoaderData(); // Access popupTrigger from loader
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace("gid://shopify/Product/", "");

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  // Define tabs for navigation with icons
  const tabs = [
    {
      id: "dashboard",
      content: (
        <InlineStack gap="200" align="center">
          <Icon source={HomeIcon} />
          <Text as="span">Dashboard</Text>
        </InlineStack>
      ),
      accessibilityLabel: "Dashboard",
      onClick: () => navigate("/app"),
    },
    {
      id: "customers",
      content: (
        <InlineStack gap="200" align="center">
          <Icon source={PersonFilledIcon} />
          <Text as="span">Customers</Text>
        </InlineStack>
      ),
      accessibilityLabel: "Customers",
      onClick: () => navigate("/customers"),
    },
    {
      id: "setup",
      content: (
        <InlineStack gap="200" align="center">
          <Icon source={SettingsIcon} />
          <Text as="span">Setup</Text>
        </InlineStack>
      ),
      accessibilityLabel: "Setup",
      onClick: () => navigate("/setup"),
    },
    {
      id: "email-settings",
      content: (
        <InlineStack gap="200" align="center">
          <Icon source={EmailIcon} />
          <Text as="span">Email Settings</Text>
        </InlineStack>
      ),
      accessibilityLabel: "Email Settings",
      onClick: () => navigate("/emailsetting"),
    },
  ];

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    tabs[selectedTabIndex].onClick();
  };

  return (
    <Frame>
      <Page
        title="Complete Age Verification Solution"
        subtitle="Protect your business with automated age verification for Shopify stores"
      >
        <TitleBar title="DASHBOARD" />
        <div style={{ marginLeft: "-13px" }}>
          <Tabs
            tabs={tabs.map(({ id, content, accessibilityLabel }) => ({
              id,
              content,
              accessibilityLabel,
            }))}
            selected={selectedTab}
            onSelect={handleTabChange}
            fitted
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "21px", flexWrap: "wrap" }}>
            {[
              {
                title: "Total Verifications",
                value: "0.0",
                badge: { status: "success", text: "no data of month", tone: "success" },
                icon: <ShieldCheckMarkIcon />,
              },
              {
                title: "Pending Reviews",
                value: "0",
                badge: { status: "warning", text: "0 report last month" },
                icon: <AlertTriangleIcon />,
              },
              {
                title: "Success Rate",
                value: "0.0",
                badge: { status: "info", text: "no from last month" },
                icon: <ArrowDiagonalIcon />,
              },
              {
                title: "Active Customers",
                value: "0",
                badge: { status: "new", text: "0 from last month" },
                icon: <PersonFilledIcon />,
              },
            ].map((card, index) => (
              <div key={index} style={{ width: "220px", position: "relative", paddingTop: "10px" }}>
                <Card sectioned>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <Text variant="headingSm" as="h6" style={{ marginRight: "8ly" }}>
                      {card.title}
                    </Text>
                    <div style={{ width: "20px" }}>{card.icon}</div>
                  </div>
                  <Text variant="headingLg" as="h5" style={{ marginBottom: "8px" }}>
                    {card.value}
                  </Text>
                  <Badge status={card.badge.status} progress="complete">
                    {card.badge.text}
                  </Badge>
                </Card>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "26px", alignItems: "stretch" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", height: "100%" }}>
              <Card sectioned style={{ flex: 1 }}>
                <Text variant="headingMd" as="h3">Recent Verifications</Text>
                <Text variant="bodySm" as="p" color="subdued">
                  Latest customer verification attempts
                </Text>
                <div>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginTop: "8px" }}></div>
                      <Text as="p">
                        Customer 1 <br />
                        <Text as="span" color="subdued">
                          customer@example.com<br />
                          #a • 2 minutes ago
                        </Text>
                      </Text>
                    </div>
                    <Badge status="success" tone="success">Verified</Badge>
                  </div>
                  <Divider />
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", marginTop: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <Text as="p">
                        Sarah Johnson<br />
                        <Text as="span" color="subdued">
                          sarah@example.com<br />
                          #12346 • 5 minutes ago
                        </Text>
                      </Text>
                    </div>
                    <Badge status="attention" tone="attention">Pending</Badge>
                  </div>
                  <Divider />
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", marginTop: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <Text as="p">
                        Mike Wilson<br />
                        <Text as="span" color="subdued">
                          mike@example.com<br />
                          #12347 • 10 minutes ago
                        </Text>
                      </Text>
                    </div>
                    <Badge status="critical" tone="critical">Rejected</Badge>
                  </div>
                  <Divider />
                </div>
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <Button fullWidth onClick={() => navigate("/customers")}>
                    View All Verifications
                  </Button>
                </div>
              </Card>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>
              <Card sectioned>
                <Text variant="headingSm" as="h6">Quick Actions</Text>
                <p>Manage your verification settings</p>
                <br />
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    height: "240px",
                    alignItems: "flex-start",
                  }}
                >
                  <Button
                    icon={ClipboardCheckIcon}
                    onClick={() => navigate("/customers")}
                    monochrome
                    outline
                    fullWidth
                     textAlign="left"
                  >
                    Review Pending IDs
                  </Button>
                  <Button
                    icon={EmailIcon}
                    onClick={() => navigate("/emailsetting")}
                    monochrome
                    outline
                    fullWidth
                      textAlign="left"
                  >
                    Email Templates
                  </Button>
                  <Button
                    icon={ShieldCheckMarkIcon}
                    onClick={() => navigate("/setup")}
                    monochrome
                    outline
                    fullWidth
                      textAlign="left"
                  >
                    Verification Rules
                  </Button>
                  <Button
                    icon={PersonFilledIcon}
                    onClick={() => navigate("/customers")}
                    monochrome
                    outline
                    fullWidth
                      textAlign="left"
                  >
                    Customer Reports
                  </Button>
                </div>
              </Card>
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Card roundedAbove="sm">
              <BlockStack gap="200" padding="600">
                <Text as="h2" variant="headingLg">
                  Shopify Integration Status
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Your store integration details
                </Text>
                <div style={{ marginLeft: "47px" }}>
                  <InlineStack gap="800" wrap={false}>
                    <div style={{ width: "250px" }}>
                      <Card roundedAbove="sm" padding="400">
                        <BlockStack align="center" gap="300">
                          <Icon source={ShieldCheckMarkIcon} tone="success" />
                          <div style={{ marginLeft: "64px" }}>
                            <Text as="h3" variant="headingSm">
                              Connected
                            </Text>
                            <div style={{ marginLeft: "-27px" }}>
                              <Text as="p" tone="subdued">
                                mystore.myshopify.com
                              </Text>
                            </div>
                          </div>
                        </BlockStack>
                      </Card>
                    </div>
                    <div style={{ width: "250px" }}>
                      <Card roundedAbove="sm" padding="400">
                        <BlockStack align="center" gap="300">
                          <Icon source={EmailIcon} tone="highlight" />
                          <div style={{ marginLeft: "64px" }}>
                            <Text as="h3" variant="headingSm">
                              Auto-Trigger
                            </Text>
                            <div style={{ marginLeft: "10px" }}>
                            <Text as="p" tone="subdued">
                              {popupTrigger} 
                            </Text>
                            </div>
                          </div>
                        </BlockStack>
                      </Card>
                    </div>
                    <div style={{ width: "250px" }}>
                      <Card roundedAbove="sm" padding="400">
                        <BlockStack align="center" gap="300">
                          <Icon source={EmailIcon} tone="info" />
                          <div style={{ marginLeft: "64px" }}>
                            <Text as="h3" variant="headingSm">
                              Email Service
                            </Text>
                            <div style={{ marginLeft: "30px" }}>
                              <Text as="p" tone="subdued">
                                Active
                              </Text>
                            </div>
                          </div>
                        </BlockStack>
                      </Card>
                    </div>
                  </InlineStack>
                </div>
              </BlockStack>
            </Card>
          </div>
        </div>
      </Page>
    </Frame>
  );
}