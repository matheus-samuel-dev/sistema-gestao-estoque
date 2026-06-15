import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Grid
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import { getProducts } from "../services/productService";
import { createMovement } from "../services/stockMovementService";

export default function StockMovement() {

    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [type, setType] = useState("ENTRY");

    useEffect(() => {

        const loadProducts = async () => {

            try {

                const data = await getProducts();

                setProducts(data);

            } catch (error) {

                console.error(error);

            }

        };

        loadProducts();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await createMovement({
                productId,
                quantity: Number(quantity),
                type
            });

            alert("Movimentação registrada com sucesso!");

            setProductId("");
            setQuantity("");
            setType("ENTRY");

        } catch (error) {

            console.error(error);

            alert("Erro ao registrar movimentação");

        }

    };

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Nova Movimentação
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 700,
                    borderRadius: 3
                }}
            >

                <form onSubmit={handleSubmit}>

                    <Grid container spacing={3}>

                        <Grid item xs={12}>

                            <TextField
                                select
                                fullWidth
                                label="Produto"
                                value={productId}
                                onChange={(e) =>
                                    setProductId(e.target.value)
                                }
                                required
                            >

                                {products.map(product => (

                                    <MenuItem
                                        key={product.id}
                                        value={product.id}
                                    >
                                        {product.name}
                                    </MenuItem>

                                ))}

                            </TextField>

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Quantidade"
                                type="number"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(e.target.value)
                                }
                                required
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                select
                                fullWidth
                                label="Tipo de Movimentação"
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value)
                                }
                            >

                                <MenuItem value="ENTRY">
                                    Entrada
                                </MenuItem>

                                <MenuItem value="EXIT">
                                    Saída
                                </MenuItem>

                            </TextField>

                        </Grid>

                        <Grid item xs={12}>

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                            >

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                >
                                    Salvar Movimentação
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </form>

            </Paper>

        </Box>

    );

}