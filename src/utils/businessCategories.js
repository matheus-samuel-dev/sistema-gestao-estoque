export const BUSINESS_CATEGORY_SUGGESTIONS = {
  Farmácia: [
    "Medicamentos",
    "Higiene pessoal",
    "Cosméticos",
    "Suplementos",
    "Produtos hospitalares",
    "Perfumaria",
    "Outros",
  ],
  Informática: [
    "Computadores",
    "Periféricos",
    "Hardware",
    "Software",
    "Acessórios",
    "Outros",
  ],
  Mercado: [
    "Alimentos",
    "Bebidas",
    "Limpeza",
    "Higiene",
    "Hortifruti",
    "Congelados",
    "Outros",
  ],
  Supermercado: [
    "Alimentos",
    "Bebidas",
    "Limpeza",
    "Higiene",
    "Hortifruti",
    "Congelados",
    "Outros",
  ],
  "Loja de roupas": [
    "Camisetas",
    "Calças",
    "Vestidos",
    "Calçados",
    "Acessórios",
    "Infantil",
    "Outros",
  ],
  "Assistência técnica": [
    "Peças",
    "Ferramentas",
    "Equipamentos",
    "Acessórios",
    "Eletrônicos",
    "Produtos para reparo",
    "Outros",
  ],
  Distribuidora: [
    "Produtos acabados",
    "Embalagens",
    "Insumos",
    "Atacado",
    "Logística",
    "Outros",
  ],
  Loja: [
    "Produtos",
    "Acessórios",
    "Embalagens",
    "Promoções",
    "Reposição",
    "Outros",
  ],
  Outro: [
    "Produtos",
    "Equipamentos",
    "Materiais",
    "Ferramentas",
    "Insumos",
    "Outros",
  ],
};

export const BUSINESS_TYPES = Object.keys(BUSINESS_CATEGORY_SUGGESTIONS);

export const getSuggestedCategories = (businessType) => (
  BUSINESS_CATEGORY_SUGGESTIONS[businessType] || BUSINESS_CATEGORY_SUGGESTIONS.Outro
);
