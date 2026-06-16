import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider }
from "@react-oauth/google";

import App from "./App";

createRoot(
 document.getElementById("root")
).render(

 <StrictMode>

  <GoogleOAuthProvider
   clientId={
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "445772204887-2jfgn13gvqs0ljq2k9v8th81aub675pa.apps.googleusercontent.com"
   }
  >
    <App />
  </GoogleOAuthProvider>

 </StrictMode>

);
