# Near Me - Google Shopping Local Automatizado via API SEFAZ

O **Near Me** é um aplicativo inteligente de busca de produtos locais que conecta consumidores a estabelecimentos físicos próximos em tempo real. Ele soluciona o maior problema do comércio de vizinhança: a desatualização de estoque e preços em canais digitais.

A nossa tecnologia inovadora elimina a fricção de cadastramento manual: conectamos o aplicativo diretamente à base da **SEFAZ (Secretaria da Fazenda)** para atualizar o estoque e preços reativamente a cada nota de entrada (**NF-e**) e saída (**NFC-e / SAT**) emitida pelo estabelecimento.

---

## 🎯 Proposta de Valor Comercial

### Para o Consumidor:
* **Busca Local com Acurácia de 100%:** Saiba exatamente se o produto que você quer (um pneu aro 15, um lubrificante, fralda, pilha) está disponível na loja da esquina neste momento.
* **Melhor Preço Próximo:** Compare os preços reais praticados nos caixas dos estabelecimentos a poucos metros de você.
* **Clique & Retire (Quick Pick-up):** Compre no aplicativo (via PIX) e retire o produto em 10 minutos a caminho de casa ou do trabalho, economizando tempo e frete.

### Para o Comerciante:
* **Zero Cadastro e Integração ERP:** Esqueça integrações caras ou uploads de planilhas. Apenas conecte seu CNPJ com o Certificado Digital A1 e a plataforma monta seu estoque automaticamente.
* **Estoque e Preços Blindados:** O estoque é deduzido à medida que os cupons fiscais são impressos no caixa registradora da loja física.
* **Atração de Clientes Locais:** Apareça para motoristas e pedestres que estão passando na região precisando de um produto imediato.

---

## 🚀 Principais Funcionalidades do Protótipo

* **Buscador de Produtos:** Interface limpa e minimalista para buscar produtos em estoque no comércio local.
* **Mapa de Resultados:** Exibição interativa das lojas, indicando preços e distância exata em quilômetros.
* **Badges de Disponibilidade:** Sinalizadores visuais de estoque (Estoque Alto, Estoque Baixo, Esgotado) baseados na atividade fiscal.
* **Simulador SEFAZ API:** Painel de testes interativo onde é possível:
  * Simular a compra de produtos (**NF-e**) de distribuidores para abastecer o estoque da loja.
  * Simular a venda no caixa (**NFC-e**) e ver o preço anunciado mudar e o estoque decrementar na hora.
  * Visualizar o **XML estruturado da nota fiscal** gerado para demonstração técnica.
* **Checkout Rápido:** Fluxo de compra simulando pagamento via Pix com QR Code de retirada automática.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn UI
* **Roteamento & Estado:** React Router DOM, React Context API, Lucide Icons
* **Mock & State Engine:** Engine reativa customizada para simular webhooks de notas fiscais da SEFAZ em tempo real.

---

## 💻 Como Rodar o Projeto Localmente

### Requisitos:
* **Node.js** (versão 18 ou superior)
* **npm** ou **bun**

### Instalação:
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/near-me.git
   cd near-me
   ```

2. Instale as dependências:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no seu navegador: `http://localhost:8080/`

---

## 🗺️ Visão Estratégica e Pitch de Negócios

Acesse os documentos de negócios criados para apresentação a investidores e parceiros (como **Zapay / Sem Parar**):
* [Plano de Negócios (BUSINESS_PLAN.md)](BUSINESS_PLAN.md): Estrutura de mercado, divisão de tarefas na equipe e viabilidade financeira.
* [Integração SEFAZ (SEFAZ_INTEGRATION.md)](SEFAZ_INTEGRATION.md): Detalhamento técnico da leitura das tags XML, LGPD e as sinergias comerciais com tags de pagamento automático.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.
