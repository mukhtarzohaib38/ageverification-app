import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
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
  Navigation,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {
   ShieldCheckMarkIcon,
  EmailIcon,
  HomeIcon,
  PersonFilledIcon,
  SettingsIcon,
  CircleChevronRightIcon,

} from "@shopify/polaris-icons";
import { useNavigate } from "@remix-run/react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

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

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const navigate = useNavigate();
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

  return (
    <Frame >
      <div style={{ marginBottom: "1rem",marginLeft:"-115px", backgroundColor:'white',padding:'4px'}}>
      <InlineStack align="space-evenly" gap="200">
        <Button icon={HomeIcon} onClick={() => navigate("/app")} variant="plain">
          Dashboard
        </Button>
        <Button icon={ PersonFilledIcon} onClick={() => navigate("/customers")} variant="plain">
          Customers
        </Button>
        <Button icon={SettingsIcon} onClick={() => navigate("/setup")}variant="plain">
          Setup
        </Button>
        <Button icon={EmailIcon} onClick={() => navigate("/emailsetting")} variant="plain">
          Email Settings
        </Button>
      </InlineStack>
      <Divider />
    </div>
      <Page>
        <TitleBar title="DASHBOARD"></TitleBar>
        <div style={{ display: "flex", gap: "20px"}}>
          <div style={{width:"240px"}}>
          <Card sectioned>
        
            <Text variant="headingSm" as="h6">
              Total Verifications
            </Text>
            <p>0.0</p>
            <Badge status="success">no data of month</Badge>
           
          </Card>
          </div>
             <div style={{width:"240px"}}>
          <Card sectioned>
            <Text variant="headingSm" as="h6">
              Pending Reviews
            </Text>
            <p>0</p>
            <Badge status="warning">0 report last month</Badge>
          </Card>
          </div>
             <div style={{width:"240px"}}>
          <Card sectioned>
            <Text variant="headingSm" as="h6">
              Success Rate
            </Text>
            <p>0.0</p>
            <Badge status="info">no from last month</Badge>
          </Card>
          </div>
             <div style={{width:"240px"}}>
          <Card sectioned>
            <Text variant="headingSm" as="h6">
              Active Customers
            </Text>
            <p>0</p>
            <Badge status="new">0 from last month</Badge>
          </Card>
          </div>
        </div>
        {/* New section below - two divs side-by-side */}
       <div style={{ display: "flex", gap: "10px", marginTop: "40px", alignItems: "stretch" }}>
  {/* Left div */}
  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", height: "100%" }}>
    <Card sectioned style={{ flex: 1 }}>
      <Text variant="headingMd" as="h3">Recent Verifications</Text>
      <Text variant="bodySm" as="p" color="subdued">
        Latest customer verification attempts
      </Text>
      <div>
        {/* John Smith */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <Text as="p">
              Customer 1 <br />
              <Text as="span" color="subdued">
                customer@example.com<br />
                #a • 2 minutes ago
              </Text>
            </Text>
          </div>
          <Badge status="success">Verified</Badge>
        </div>
        <Divider />
        {/* Sarah Johnson */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <Text as="p">
              Sarah Johnson<br />
              <Text as="span" color="subdued">
                sarah@example.com<br />
                #12346 • 5 minutes ago
              </Text>
            </Text>
          </div>
          <Badge status="attention">Pending</Badge>
        </div>
        <Divider />
        {/* Mike Wilson */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <Text as="p">
              Mike Wilson<br />
              <Text as="span" color="subdued">
                mike@example.com<br />
                #12347 • 10 minutes ago
              </Text>
            </Text>
          </div>
          <Badge status="critical">Rejected</Badge>
        </div>
        <Divider />
      </div>
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Button>View All Verifications</Button>
      </div>
    </Card>
  </div>

  {/* Right div */}
  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>
   
    <Card sectioned style={{ flex: 1 }}>
      <Text variant="headingSm" as="h6">Quick Actions</Text>
      <p>Manage your verification settings</p>
      <ul style={{ paddingLeft: "20px", marginTop: "10px",height:"223px" }}>
        <li style={{ marginBottom: "10px" }}>
          <Button plain onClick={() => console.log("Review Pending IDs clicked")}>
            Review Pending IDs
          </Button>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Button plain onClick={() => console.log("Email Templates clicked")}>
            Email Templates
          </Button>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Button plain onClick={() => console.log("Verification Rules clicked")}>
            Verification Rules
          </Button>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Button plain onClick={() => console.log("Customer Reports clicked")}>
            Customer Reports
          </Button>
        </li>
      </ul>
    </Card>
    </div>
</div>
         <div style={{ marginTop: '20px' }}>
      <Card roundedAbove="sm">
        <BlockStack gap="200" padding="600">
          <Text as="h2" variant="headingLg">
            Shopify Integration Status
          </Text>
          <Text as="p" variant="bodyMd" tone="subdued">
            Your store integration details
          </Text>

          <InlineStack gap="800" wrap={false}>
            {/* Connected Card */}
            <div style={{ width: '250px' }}>
              <Card roundedAbove="sm" padding="400">
                <BlockStack align="center" gap="300">
                  <Icon source={ ShieldCheckMarkIcon} tone="success" />
                  <div style={{marginLeft:"64px"}}>
                  <Text as="h3" variant="headingSm">
                    Connected
                  </Text>
                  <Text as="p" tone="subdued">
                    mystore.myshopify.com
                  </Text>
                  </div>
                </BlockStack>
              </Card>
            </div>

            {/* Auto-Trigger Card */}
            <div style={{ width: '250px' }}>
              <Card roundedAbove="sm" padding="400">
                <BlockStack align="center" gap="300">
                  <Icon source={EmailIcon} tone="highlight" />
                     <div style={{marginLeft:"64px"}}>
                  <Text as="h3" variant="headingSm">
                    Auto-Trigger
                  </Text>
                  <Text as="p" tone="subdued">
                    On checkout
                  </Text>
                  </div>
                </BlockStack>
              </Card>
            </div>

            {/* Email Service Card */}
            <div style={{ width: '250px' }}>
              <Card roundedAbove="sm" padding="400">
                <BlockStack align="center" gap="300">
                  <Icon source={EmailIcon} tone="info" />
                  <div style={{marginLeft:"64px"}}>
                  <Text as="h3" variant="headingSm">
                    Email Service
                  </Text>
                  <Text as="p" tone="subdued">
                    Active
                  </Text>
                  </div>
                </BlockStack>
              </Card>
            </div>
          </InlineStack>
        </BlockStack>
      </Card>
    </div>
      </Page>
    </Frame>
  );
}