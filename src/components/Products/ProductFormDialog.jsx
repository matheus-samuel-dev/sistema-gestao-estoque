import { useMemo, useState } from "react";
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, FormControl, FormHelperText, Grid, InputAdornment, InputLabel,
  MenuItem, Select, TextField, Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { currencyInput, formatCurrency, parseCurrency } from "../../utils/formatters";

const ORIGINS = [
  ["PURCHASE", "Compra"], ["DONATION", "Doação"], ["TRANSFER", "Transferência"],
  ["INTERNAL_PRODUCTION", "Produção interna"], ["STOCK_ADJUSTMENT", "Ajuste de estoque"], ["OTHER", "Outro"],
];

const emptyForm = {
  name: "", internalCode: "", sku: "", barcode: "", serialNumber: "",
  description: "", brand: "", model: "", categoryId: "", physicalLocation: "",
  price: "", quantity: "", minimumQuantity: "", origin: "PURCHASE", notes: "",
};

export default function ProductFormDialog({ open, product, categories, loading, onClose, onSave }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => product ? {
    ...emptyForm, ...product, categoryId: product.category?.id || "",
    price: formatCurrency(product.price), quantity: String(product.quantity ?? ""),
    minimumQuantity: String(product.minimumQuantity ?? ""), origin: product.origin || "OTHER",
  } : emptyForm);
  const [touched, setTouched] = useState({});
  const activeCategories = useMemo(() => categories.filter((item) => item.active !== false), [categories]);

  const errors = {
    name: !form.name.trim() ? "Nome é obrigatório" : "",
    categoryId: !form.categoryId ? "Categoria é obrigatória" : "",
    price: parseCurrency(form.price) < 0 ? "Valor inválido" : !form.price ? "Valor unitário é obrigatório" : "",
    quantity: form.quantity === "" || Number(form.quantity) < 0 ? "Quantidade inválida" : "",
    minimumQuantity: form.minimumQuantity === "" || Number(form.minimumQuantity) < 0 ? "Estoque mínimo inválido" : "",
  };
  const valid = Object.values(errors).every((value) => !value) && activeCategories.length > 0;

  const setValue = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const blur = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const submit = () => {
    setTouched({ name: true, categoryId: true, price: true, quantity: true, minimumQuantity: true });
    if (!valid) return;
    onSave({
      ...form,
      name: form.name.trim(),
      price: parseCurrency(form.price),
      quantity: Number(form.quantity),
      minimumQuantity: Number(form.minimumQuantity),
    });
  };

  const field = (name, label, props = {}) => (
    <TextField fullWidth label={label} value={form[name] || ""} onChange={setValue(name)} {...props} />
  );

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md"
      slotProps={{ paper: { sx: { m: { xs: 1, sm: 3 }, width: { xs: "calc(100% - 16px)", sm: "100%" }, maxHeight: "calc(100dvh - 24px)" } } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={800}>{product ? "Editar produto" : "Novo produto"}</Typography>
        <Typography variant="body2" color="text.secondary">Organize as informações essenciais e complemente conforme o seu negócio.</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {activeCategories.length === 0 && (
          <Alert severity="warning" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={() => navigate("/categories")}>Cadastrar categoria</Button>}>
            Nenhuma categoria encontrada. Cadastre uma categoria antes de criar produtos.
          </Alert>
        )}

        <Typography variant="overline" color="primary" fontWeight={800}>Identificação</Typography>
        <Grid container spacing={2} sx={{ mt: 0.25 }}>
          <Grid size={{ xs: 12, md: 8 }}><TextField fullWidth required label="Nome" value={form.name} onChange={setValue("name")} onBlur={blur("name")} error={Boolean(touched.name && errors.name)} helperText={touched.name && errors.name} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}>{field("internalCode", "Código interno")}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("sku", "SKU")}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("barcode", "Código de barras")}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("serialNumber", "Número de série")}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("brand", "Marca")}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("model", "Modelo")}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{field("physicalLocation", "Localização física", { placeholder: "Ex.: Almoxarifado A, prateleira 3" })}</Grid>
          <Grid size={{ xs: 12 }}>{field("description", "Descrição", { multiline: true, minRows: 2 })}</Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="overline" color="primary" fontWeight={800}>Organização e estoque</Typography>
        <Grid container spacing={2} sx={{ mt: 0.25 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required error={Boolean(touched.categoryId && errors.categoryId)}>
              <InputLabel>Categoria</InputLabel>
              <Select value={form.categoryId} label="Categoria" onChange={setValue("categoryId")} onBlur={blur("categoryId")}>
                {activeCategories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
              </Select>
              {touched.categoryId && errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth><InputLabel>Origem</InputLabel><Select value={form.origin} label="Origem" onChange={setValue("origin")}>{ORIGINS.map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</Select></FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth required label="Valor unitário" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: currencyInput(event.target.value) }))} onBlur={blur("price")} error={Boolean(touched.price && errors.price)} helperText={touched.price && errors.price} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth required type="number" label="Quantidade" value={form.quantity} onChange={setValue("quantity")} onBlur={blur("quantity")} error={Boolean(touched.quantity && errors.quantity)} helperText={touched.quantity && errors.quantity} slotProps={{ htmlInput: { min: 0 } }} /></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth required type="number" label="Estoque mínimo" value={form.minimumQuantity} onChange={setValue("minimumQuantity")} onBlur={blur("minimumQuantity")} error={Boolean(touched.minimumQuantity && errors.minimumQuantity)} helperText={touched.minimumQuantity && errors.minimumQuantity} slotProps={{ htmlInput: { min: 0 } }} /></Grid>
          <Grid size={{ xs: 12 }}><TextField fullWidth label="Valor total em estoque" value={formatCurrency(parseCurrency(form.price) * (Number(form.quantity) || 0))} disabled slotProps={{ input: { startAdornment: <InputAdornment position="start">∑</InputAdornment> } }} /></Grid>
          <Grid size={{ xs: 12 }}>{field("notes", "Observações", { multiline: true, minRows: 2 })}</Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, flexWrap: "wrap" }}>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button variant="contained" onClick={submit} disabled={loading || !valid}>{loading ? "Salvando..." : "Salvar produto"}</Button>
      </DialogActions>
    </Dialog>
  );
}
