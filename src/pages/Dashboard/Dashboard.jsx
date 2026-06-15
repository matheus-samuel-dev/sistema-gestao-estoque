import { useEffect, useState } from "react";

import {
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
} from "@mui/material";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import DashboardCard from "../../components/Dashboard/DashboardCard";

import {
    getDashboardData,
    getProductsByCategory,
} from "../../services/dashboardService";
import { getMovements } from "../../services/stockMovementService";
import { getLatestProducts } from "../../services/productService";

const COLORS = [
    "#1976d2",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
    "#607d8b",
];

function Dashboard() {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        lowStock: 0,
        outOfStock: 0,
    });

    const [categoryData, setCategoryData] = useState([]);
    const [movementData, setMovementData] = useState([]);
    const [movementSummary, setMovementSummary] = useState([]);
    const [latestMovements, setLatestMovements] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [
                    dashboardData,
                    categoriesData,
                    movements,
                    products,
                ] = await Promise.all([
                    getDashboardData(),
                    getProductsByCategory(),
                    getMovements(),
                    getLatestProducts(),
                ]);

                const latest = [...movements]
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    )
                    .slice(0, 5);

                const entradas = movements
                    .filter((movement) => movement.type === "ENTRY")
                    .reduce(
                        (total, movement) =>
                            total + Number(movement.quantity),
                        0
                    );

                const saidas = movements
                    .filter((movement) => movement.type === "EXIT")
                    .reduce(
                        (total, movement) =>
                            total + Number(movement.quantity),
                        0
                    );

                setStats(dashboardData);
                setCategoryData(categoriesData);
                setMovementData(movements);
                setLatestMovements(latest);
                setLatestProducts(products);
                setMovementSummary([
                    {
                        tipo: "Entradas",
                        quantidade: entradas,
                    },
                    {
                        tipo: "Saídas",
                        quantidade: saidas,
                    },
                ]);
            } catch (error) {
                console.error(error);
            }
        };

        loadDashboard();
    }, []);

    return (
        <>
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Dashboard
            </Typography>

            <Grid
                container
                spacing={3}
                sx={{ alignItems: "stretch" }}
            >
                <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
                    <DashboardCard
                        title="PRODUTOS"
                        value={stats.products}
                        subtitle="Itens cadastrados"
                        icon={<InventoryIcon />}
                        color="#1976d2"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
                    <DashboardCard
                        title="CATEGORIAS"
                        value={stats.categories}
                        subtitle="Categorias ativas"
                        icon={<CategoryIcon />}
                        color="#4caf50"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
                    <DashboardCard
                        title="ESTOQUE BAIXO"
                        value={stats.lowStock}
                        subtitle="Produtos abaixo do mínimo"
                        icon={<WarningAmberIcon />}
                        color="#ff9800"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
                    <DashboardCard
                        title="SEM ESTOQUE"
                        value={stats.outOfStock}
                        subtitle="Produtos zerados"
                        icon={<CancelIcon />}
                        color="#e53935"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
                    <DashboardCard
                        title="MOVIMENTAÇÕES"
                        value={movementData.length}
                        subtitle="Movimentações registradas"
                        icon={<SwapHorizIcon />}
                        color="#673ab7"
                    />
                </Grid>

                <Grid size={{ xs: 12, xl: 8 }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Entradas x Saídas
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >
                            <BarChart data={movementSummary}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="tipo" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="quantidade"
                                    radius={[8, 8, 0, 0]}
                                    fill="#1976d2"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, xl: 4 }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Produtos por Categoria
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="products"
                                    nameKey="category"
                                    outerRadius={120}
                                    label
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={entry.category ?? index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, xl: 6 }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Últimas Movimentações
                        </Typography>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Quantidade</TableCell>
                                    <TableCell>Data</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {latestMovements.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            Nenhuma movimentação registrada.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {latestMovements.map((movement, index) => (
                                    <TableRow
                                        key={movement.id ?? `${movement.createdAt}-${index}`}
                                    >
                                        <TableCell>
                                            {movement.product?.name ?? "-"}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={
                                                    movement.type === "ENTRY"
                                                        ? "Entrada"
                                                        : "Saída"
                                                }
                                                color={
                                                    movement.type === "ENTRY"
                                                        ? "success"
                                                        : "error"
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {movement.quantity}
                                        </TableCell>

                                        <TableCell>
                                            {movement.createdAt
                                                ? new Date(
                                                    movement.createdAt
                                                ).toLocaleDateString("pt-BR")
                                                : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, xl: 6 }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Últimos Produtos Cadastrados
                        </Typography>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell>Categoria</TableCell>
                                    <TableCell>Estoque</TableCell>
                                    <TableCell>Preço</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {latestProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            Nenhum produto cadastrado.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {latestProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {product.name}
                                        </TableCell>

                                        <TableCell>
                                            {product.category?.name ?? "-"}
                                        </TableCell>

                                        <TableCell>
                                            {product.quantity}
                                        </TableCell>

                                        <TableCell>
                                            {Number(product.price).toLocaleString(
                                                "pt-BR",
                                                {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;
