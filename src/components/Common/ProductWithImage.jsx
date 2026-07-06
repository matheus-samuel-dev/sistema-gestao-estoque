import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import api from "../../services/api";

export default function ProductWithImage({
  product,
  name,
  code,
  complement,
  thumbnailUrl,
  size = 44,
}) {
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);

  const displayName = name || product?.name || product?.productName || "-";
  const displayCode = code || product?.internalCode || product?.productCode || product?.sku || "";
  const displayComplement = complement || product?.category?.name || product?.brand || product?.model || "";
  const imageUrl = useMemo(() => thumbnailUrl || product?.thumbnailUrl || "", [product, thumbnailUrl]);

  useEffect(() => {
    let revokedUrl = "";
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFailed(false);
    setSrc("");

    if (!imageUrl) return undefined;

    api.get(imageUrl, { responseType: "blob" })
      .then((response) => {
        if (!active) return;
        revokedUrl = URL.createObjectURL(response.data);
        setSrc(revokedUrl);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
      if (revokedUrl) URL.revokeObjectURL(revokedUrl);
    };
  }, [imageUrl]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
      <Box
        sx={{
          width: size,
          height: size,
          flex: `0 0 ${size}px`,
          borderRadius: 1.25,
          overflow: "hidden",
          bgcolor: "#eef2f7",
          border: "1px solid #e2e8f0",
          display: "grid",
          placeItems: "center",
        }}
      >
        {src && !failed ? (
          <Box
            component="img"
            src={src}
            alt={displayName}
            onError={() => setFailed(true)}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <Inventory2OutlinedIcon sx={{ fontSize: Math.max(20, size * 0.52), color: "text.disabled" }} />
        )}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={800} noWrap title={displayName}>
          {displayName}
        </Typography>
        {(displayCode || displayComplement) && (
          <Typography variant="caption" color="text.secondary" noWrap title={[displayCode, displayComplement].filter(Boolean).join(" • ")}>
            {[displayCode, displayComplement].filter(Boolean).join(" • ")}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
