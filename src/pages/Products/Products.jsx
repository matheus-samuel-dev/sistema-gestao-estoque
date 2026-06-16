import {
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";

import { useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
} from "../../services/productService";

import {
    getCategories,
} from "../../services/categoryService";

/* const produtos = [
    {
        id: 1,
        nome: "Notebook Dell",
        categoria: "Informática",
        estoque: 15,
    },
    {
        id: 2,
        nome: "Mouse Logitech",
        categoria: "Informática",
        estoque: 50,
    },
    {
        id: 3,
        nome: "Teclado Mecânico",
        categoria: "Periféricos",
        estoque: 25,
    },
]; */

function Products() {

    const [open, setOpen] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        quantity: "",
        minimumQuantity: "",
        categoryId: "",
    });

    const [produtos, setProdutos] = useState([]);
    const [categories, setCategories] = useState([]);

    const handleSearch = async (value) => {

    if (!value.trim()) {
        // eslint-disable-next-line react-hooks/immutability
        loadProducts();
        return;
    }

    try {
        const products = await searchProducts(value);
        setProdutos(products);
    } catch (error) {
        console.error(error);
    }
};

    const handleSubmit = async () => {
        try {
            const payload = {
                name: formData.name,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                minimumQuantity: Number(formData.minimumQuantity),
                categoryId: formData.categoryId,
            };
            if (editingProduct) {
                await updateProduct(editingProduct.id, payload);
            } else {
                await createProduct(payload);
            }

            loadProducts();

            setOpen(false);
            setEditingProduct(null);

            setFormData({
                name: "",
                price: "",
                quantity: "",
                minimumQuantity: "",
                categoryId: "",
            });

        } catch (error) {
            console.log("STATUS:");
            console.log(error.response?.status);

            console.log("DATA:");
            console.log(error.response?.data);

            console.log("HEADERS:");
            console.log(error.response?.headers);


            console.log(error);
        }
    };


    const handleOpen = () => {
        setEditingProduct(null);

        setFormData({
            name: "",
            price: "",
            quantity: "",
            categoryId: "",
        });

        setOpen(true);
    };

    const handleEdit = (product) => {

        setEditingProduct(product);

        setFormData({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            categoryId: product.category.id,
            minimumQuantity: product.minimumQuantity,
        });

        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            loadProducts();
        } catch (error) {

            console.log("STATUS:");
            console.log(error.response?.status);

            console.log("DATA:");
            console.log(error.response?.data);

            console.log("HEADERS:");
            console.log(error.response?.headers);

            console.log(error);

        }

    }

    const handleChange = (e) => {

        let { name, value } = e.target;

        if (name === "name") {
            value = value.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, "");
        }

        if (
            name === "quantity" ||
            name === "minimumQuantity"
        ) {
            value = value.replace(/\D/g, "");
        }

        if (name === "price") {
            value = value.replace(/[^0-9.]/g, "");
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/immutability
        loadCategories();
    }, []);

    async function loadProducts() {
        try {
            const data = await getProducts();
            setProdutos(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadCategories() {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Produtos
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.2,
                    }}
                >
                    Novo Produto
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Pesquisar produto..."
                    variant="outlined"
                    onChange={(e) => handleSearch(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        backgroundColor: "white",
                        borderRadius: 2,
                    }}
                />
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Table>
                    <TableHead
                        sx={{
                            backgroundColor: "#f5f7fb",
                        }}
                    >
                        <TableRow>
                            <TableCell>
                                <strong>ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Nome</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Categoria</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Estoque</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Ações</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {produtos.map((produto) => (
                            <TableRow
                                key={produto.id}
                                hover
                            >
                                <TableCell>
                                    {produto.id}
                                </TableCell>

                                <TableCell>
                                    {produto.name}
                                </TableCell>

                                <TableCell>
                                    {produto.category?.name}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={`${produto.quantity} un.`}
                                        color={
                                            produto.quantity > 30
                                                ? "success"
                                                : produto.quantity > 10
                                                    ? "warning"
                                                    : "error"
                                        }
                                        sx={{
                                            fontWeight: "bold",
                                            minWidth: 80,
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        sx={{
                                            backgroundColor: "#e3f2fd",
                                            mr: 1,
                                        }}

                                        onClick={() => handleEdit(produto)}
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        sx={{
                                            backgroundColor: "#ffebee",
                                        }}
                                        onClick={() => handleDelete(produto.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingProduct
                        ? "Editar Produto"
                        : "Novo Produto"}
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Nome"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Preço"
                        name="price"
                        type="text"
                        value={formData.price}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Categoria
                        </InputLabel>

                        <Select
                            name="categoryId"
                            value={formData.categoryId}
                            label="Categoria"
                            onChange={handleChange}
                        >
                            {categories.map(
                                (category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Quantidade"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Quantidade Mínima"
                        name="minimumQuantity"
                        type="number"
                        value={formData.minimumQuantity}
                        onChange={handleChange}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default Products;
