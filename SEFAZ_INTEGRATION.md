# Integração SEFAZ API: Mapeamento de Estoque e Preços em Tempo Real

Este documento apresenta o plano de negócios e a especificação técnica para a arquitetura de sincronização automática de inventário e preços baseada em Documentos Fiscais Eletrônicos (DF-e) emitidos pela **SEFAZ (Secretaria da Fazenda)**.

---

## 1. Proposta de Valor e Modelo de Negócios

### 1.1 O Desafio do Varejo Físico
Manter inventário atualizado em plataformas digitais é uma tarefa árdua para pequenos e médios comerciantes. A integração via ERP costuma ser cara e complexa, planilhas geram atrasos e erros manuais levam a estoques fantasmas, o que causa frustração quando o cliente chega para retirar o produto.

### 1.2 A Solução: Zero Friction Inventory (Estoque Zero Fricção)
Ao invés de exigir que o lojista cadastre produtos ou integre seu sistema de ERP, o aplicativo conecta-se diretamente à base de dados da SEFAZ para capturar as notas fiscais de entrada e saída do estabelecimento comercial.

```
[Distribuidor] ── NF-e (Compra) ──> [ SEFAZ ] ── NFC-e (Venda) ──> [Consumidor]
                                        │
                         Monitoramento de DFe via API
                                        │
                                        ▼
                             [ Nosso Motor de IA ]
                 Estoque Atualizado = Compras - Vendas
```

### 1.3 Principais Benefícios para o Comerciante
* **Adesão em 1 Minuto:** Apenas concede autorização por certificado digital (e-CNPJ) ou procuração fiscal eletrônica.
* **Sem Erros de Estoque:** O estoque se atualiza de acordo com o que de fato passou pelo caixa registradora (NFC-e / SAT).
* **Preços de Venda Atualizados:** O preço anunciado no app reflete sempre a última venda real realizada.

---

## 2. Arquitetura de Integração com a SEFAZ

### 2.1 Captura dos Documentos Fiscais Eletrônicos (DF-e)
Para monitorar as notas fiscais emitidas pelo CNPJ do estabelecimento, o sistema utilizará um middleware/provedor de API fiscal (como *Focus NFe*, *eNotas*, ou *Arquivei*) conectado ao Web Service da SEFAZ Federal (`NFeDistribuicaoDFe`).

Existem dois fluxos principais de documentos fiscais monitorados:

#### A) NF-e (Nota Fiscal Eletrônica de Entrada)
Emitida quando a loja adquire produtos de um distribuidor ou fabricante.
* **Ação no App:** Adiciona a quantidade de itens comprados ao estoque da loja.

#### B) NFC-e (Nota Fiscal de Consumidor Eletrônica) / SAT (Sistema Autenticador e Transmissor)
Emitida no ponto de venda (PDV / Caixa) quando um consumidor final realiza uma compra física na loja.
* **Ação no App:** Subtrai a quantidade de itens vendidos do estoque da loja e atualiza o preço exibido no aplicativo.

---

### 2.2 Processamento de Dados (Parsing do XML)

Quando o webhook da API fiscal dispara um novo XML, o nosso backend extrai as seguintes tags estruturadas:

| Tag XML | Descrição | Utilização no Sistema |
| :--- | :--- | :--- |
| `<cEAN>` / `<cEANTrib>` | Código de barras (GTIN/EAN-13) | **Identificador Único.** Permite agrupar o mesmo produto vendido em diferentes lojas físicas para fins de busca e comparação. |
| `<xProd>` | Nome do produto | Nome de exibição na busca caso seja um novo produto. |
| `<qCom>` | Quantidade comercializada | Usado na equação matemática de saldo (`Estoque = Entradas - Saídas`). |
| `<vUnCom>` | Valor unitário do produto | Preço de venda praticado em tempo real. |
| `<dhEmi>` | Data e hora de emissão | Ordenação cronológica para evitar conflitos de processamento. |
| `<CNPJ>` (Emi / Dest) | CNPJs envolvidos | Identifica qual estabelecimento está abastecendo o estoque (NF-e) ou realizando a venda (NFC-e). |

---

## 3. Segurança, LGPD e Viabilidade Jurídica

### 3.1 Conformidade com a LGPD (Lei Geral de Proteção de Dados)
* **Consentimento do Lojista:** O lojista assina um termo de adesão eletrônico autorizando a plataforma a ler seus dados fiscais para a finalidade estrita de publicidade e controle de estoque de seus produtos.
* **Dados Anonimizados dos Clientes:** Para fins de estoque, apenas os dados do *produto* (XML da nota) são lidos. Os dados pessoais do consumidor final (como CPF na nota) contidos na NFC-e **são totalmente descartados** no pipeline de processamento e não são salvos no banco de dados.

### 3.2 Segurança e Certificação Digital
* O lojista faz o upload seguro de seu Certificado Digital A1.
* A chave privada é armazenada em ambiente seguro criptografado em nuvem (KMS / HSM) apenas com permissão de leitura para comunicação direta com os Web Services da Receita Federal.

---

## 4. Oportunidades de Integração e Parcerias Estratégicas

A arquitetura descentralizada do **Near Me** permite integrar o motor de busca de estoque local a diversos ecossistemas digitais de alta escala:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MARKETPLACE / SUPER APPS                        │
│  [ Busca Local Real-Time ] ──> [ Estoque Sincronizado via SEFAZ ]      │
│                                        │                               │
│                      Compra Integrada / Clique & Retire                │
│                                        │                               │
│  [ Checkout com Gateways / Pix ] <─────┘──> [ Logística / Delivery ]   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Integração com SuperApps de Delivery:**
   * Plataformas de entrega rápida (last-mile delivery) podem consumir nossa API para exibir estoques reais de pequenos comércios próximos, eliminando o cancelamento de pedidos por falta de itens na prateleira física.
2. **Parceria com Gateways de Pagamento e Fintechs:**
   * Facilitar o pagamento seguro direto na plataforma. Fintechs parceiras podem oferecer condições especiais, cashback ou parcelamento de itens de maior valor (como pneus ou eletrônicos) no momento da compra rápida pelo app.
3. **Consolidação de Redes de Franquias e Lojas de Conveniência:**
   * Grandes redes com dezenas de franqueados (que frequentemente usam sistemas de PDV descentralizados) podem consolidar e expor seus estoques agregados em tempo real utilizando apenas o fluxo de NFC-e de suas filiais, sem precisar integrar sistemas individuais de ERP de cada loja.
