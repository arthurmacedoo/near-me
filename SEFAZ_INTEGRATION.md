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

## 4. Sinergia com o Ecossistema Sem Parar / Zapay (Grupo Corpay)

Apresentar este projeto para a diretoria do **Sem Parar** e da **Zapay** abre oportunidades estratégicas de grande escala:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SUPER APP SEM PARAR                             │
│  [ Mapa de Postos/Lojas ] ──> [ Busca de Itens via SEFAZ ]             │
│                                        │                               │
│                         Compra no App com 1 Clique                     │
│                                        │                               │
│  [ Pagamento via Fatura Sem Parar ] <──┘──> [ Parcelamento via Zapay ] │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Enriquecimento do SuperApp Sem Parar:**
   * Motoristas no trânsito buscam frequentemente por produtos de conveniência, aditivos, óleo de motor ou pneus. A tecnologia permite que eles busquem no SuperApp e saibam exatamente qual posto de gasolina ou loja física no caminho tem o item em estoque.
2. **Facilitação de Pagamentos e Cashback:**
   * O pagamento do item comprado localmente pode ser efetuado utilizando o saldo do Sem Parar ou faturado na conta mensal do motorista.
   * A **Zapay** pode entrar como o motor financeiro oficial, permitindo o parcelamento de compras de maior valor (como pneus ou peças mecânicas) via cartão de crédito ou boleto direto na plataforma.
3. **Parcerias com Redes de Postos de Combustíveis:**
   * Postos de combustíveis e lojas de conveniência (ex: BR Mania, AM/PM) emitem SAT/NFC-e para cada café, refrigerante ou lubrificante. A integração SEFAZ permite expor esses estoques no app Sem Parar sem custo de desenvolvimento de software de ERP para as franqueadoras.
