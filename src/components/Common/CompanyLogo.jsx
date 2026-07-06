import { useMemo, useState } from "react";
import { Avatar, Box } from "@mui/material";

function getInitials(name) {
  const words = String(name || "Sistema de Estoque")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "SE";
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

export default function CompanyLogo({ companyName, logoUrl, size = 44, sx }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = useMemo(() => getInitials(companyName), [companyName]);
  const hasLogo = Boolean(logoUrl && !imageFailed);

  return (
    <Avatar
      src={hasLogo ? logoUrl : undefined}
      alt={companyName || "Sistema de Estoque"}
      imgProps={{ onError: () => setImageFailed(true) }}
      sx={{
        width: size,
        height: size,
        fontWeight: 900,
        fontSize: Math.max(13, size * 0.32),
        color: "#fff",
        bgcolor: "#2563eb",
        background: hasLogo ? undefined : "linear-gradient(135deg, #2563eb 0%, #0f766e 100%)",
        boxShadow: "0 10px 22px rgba(37, 99, 235, 0.22)",
        border: "1px solid rgba(255,255,255,0.24)",
        ...sx,
      }}
    >
      {!hasLogo && (
        <Box component="span" sx={{ letterSpacing: 0, lineHeight: 1 }}>
          {initials}
        </Box>
      )}
    </Avatar>
  );
}
