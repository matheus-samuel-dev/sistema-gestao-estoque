import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  color = "#1976d2",
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        minHeight: 180,
        height: "100%",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ minHeight: 92 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
        >
          {title}
        </Typography>

        <Typography
          variant="h3"
          fontWeight="bold"
          mt={1}
        >
          {value}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: 2,
          backgroundColor: color,
          color: "white",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          mt: 2,

          "& svg": {
            fontSize: 32,
          },
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}

export default DashboardCard;
