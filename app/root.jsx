import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { AppProvider, Frame } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css"; // Required for Polaris styles

// Minimal English translations
const i18n = {
  locale: "en",
  // Required i18n keys used by Polaris components
  // You can use a full file or just bare minimum
  Polaris: {
    Avatar: {
      label: "Avatar",
      labelWithInitials: "Avatar with initials {initials}",
    },
    ContextualSaveBar: {
      save: "Save",
      discard: "Discard",
    },
    Button: {
      submit: "Submit",
      cancel: "Cancel",
    },
    Modal: {
      iFrameTitle: "Content",
    },
    // ...etc (or use the full i18n JSON from Polaris GitHub)
  },
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider i18n={i18n}>
          <Frame>
          <Outlet />
          </Frame>
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}