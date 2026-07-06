import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

const ignoredDomProps = new Set([
  "sx",
  "slotProps",
  "startIcon",
  "endIcon",
  "fullWidth",
  "maxWidth",
  "dividers",
  "elevation",
  "color",
  "variant",
  "size",
  "align",
  "component",
  "secondaryAction",
  "InputProps",
  "inputProps",
  "alignItems",
  "select",
  "multiline",
  "rows",
]);

const cleanProps = (props = {}) => Object.fromEntries(
  Object.entries(props).filter(([key]) => !ignoredDomProps.has(key))
);

const node = (tag) => ({ children, ...props }) =>
  React.createElement(tag, cleanProps(props), children);

vi.mock("@mui/material", () => {
  const Button = ({ children, startIcon, ...props }) =>
    React.createElement("button", cleanProps(props), startIcon, children);
  const IconButton = ({ children, ...props }) =>
    React.createElement("button", cleanProps(props), children);
  const TextField = ({ children, helperText, error, onChange, onBlur, value, placeholder, type = "text", label, select, ...props }) => {
    const control = select
      ? React.createElement("select", {
          ...cleanProps(props),
          value,
          onChange,
          onBlur,
          "aria-invalid": error ? "true" : "false",
        }, children)
      : React.createElement("input", {
          ...cleanProps(props),
          placeholder,
          type,
          value,
          onChange,
          onBlur,
          "aria-invalid": error ? "true" : "false",
        });

    return React.createElement(
      "div",
      {},
      label && React.createElement("label", {}, label),
      control,
      helperText && React.createElement("p", {}, helperText)
    );
  };
  const Checkbox = ({ checked, onChange, ...props }) =>
    React.createElement("input", {
      ...cleanProps(props),
      type: "checkbox",
      checked,
      onChange,
    });
  const FormControlLabel = ({ control, label, ...props }) =>
    React.createElement("label", cleanProps(props), control, label);
  const Link = ({ children, component, ...props }) =>
    React.createElement(component === "button" ? "button" : "a", cleanProps(props), children);
  const Dialog = ({ children, open = true, ...props }) =>
    open ? React.createElement("div", cleanProps(props), children) : null;
  const Select = ({ children, value, onChange, ...props }) =>
    React.createElement("select", { ...cleanProps(props), value, onChange }, children);
  const MenuItem = ({ children, value, ...props }) =>
    React.createElement("option", { ...cleanProps(props), value }, children);
  const Snackbar = ({ children, open = true, ...props }) =>
    open ? React.createElement("div", cleanProps(props), children) : null;
  const ListItem = ({ children, secondaryAction, ...props }) =>
    React.createElement("li", cleanProps(props), children, secondaryAction);

  return {
    Alert: ({ children, ...props }) => React.createElement("div", { ...cleanProps(props), role: "alert" }, children),
    Avatar: node("div"),
    Box: node("div"),
    Button,
    Card: node("div"),
    CardContent: node("div"),
    Checkbox,
    Chip: ({ label, ...props }) => React.createElement("span", cleanProps(props), label),
    CircularProgress: () => React.createElement("span", { "aria-label": "loading" }),
    Dialog,
    DialogActions: node("div"),
    DialogContent: node("div"),
    DialogTitle: node("h2"),
    Divider: node("hr"),
    FormControl: node("div"),
    FormControlLabel,
    Grid: node("div"),
    IconButton,
    InputAdornment: node("span"),
    InputLabel: node("label"),
    Link,
    LinearProgress: () => React.createElement("span", { "aria-label": "progress" }),
    List: node("ul"),
    ListItem,
    ListItemIcon: node("span"),
    ListItemText: ({ primary, secondary }) => React.createElement("span", {}, primary, secondary),
    MenuItem,
    Modal: ({ children, open = true, ...props }) =>
      open ? React.createElement("div", cleanProps(props), children) : null,
    Paper: node("div"),
    Select,
    Skeleton: node("div"),
    Snackbar,
    Stack: node("div"),
    Step: node("div"),
    StepLabel: node("span"),
    Stepper: node("div"),
    Switch: Checkbox,
    Tab: node("button"),
    Table: node("table"),
    TableBody: node("tbody"),
    TableCell: node("td"),
    TableContainer: node("div"),
    TableHead: node("thead"),
    TableRow: node("tr"),
    Tabs: node("div"),
    TextField,
    Tooltip: ({ children }) => children,
    Typography: node("p"),
  };
});

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows = [], columns = [] }) =>
    React.createElement(
      "div",
      {},
      rows.map((row) => React.createElement("div", { key: row.id }, columns.map((column) => row[column.field]).join(" ")))
    ),
}));

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
