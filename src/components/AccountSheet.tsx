import { useState } from "react";
import { Camera, CreditCard, Package, Plus, Trash2, User, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserProfile, type ProfileType } from "@/hooks/useUserProfile";
import { useOrders, type Order } from "@/hooks/useOrders";
import { useSefazSimulator } from "@/hooks/useSefazSimulator";
import { products } from "@/data/mockData";
import OrderSuccessModal from "./OrderSuccessModal";

interface AccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
}

const initialCards: SavedCard[] = [
  { id: "1", brand: "Mastercard", last4: "1234" },
  { id: "2", brand: "Visa", last4: "5678" },
];

const AccountSheet = ({ open, onOpenChange }: AccountSheetProps) => {
  const { profileType, setProfileType, business, setBusiness } = useUserProfile();
  const { orders, removeOrder } = useOrders();
  const { stores, simulateNfeReceipt, simulateNfceSale, invoiceLogs, clearLogs } = useSefazSimulator();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [name, setName] = useState("Maria Silva");
  const [email, setEmail] = useState("maria@example.com");
  const [phone, setPhone] = useState("(11) 98765-4321");
  const [cpf, setCpf] = useState("123.456.789-00");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [cards, setCards] = useState<SavedCard[]>(initialCards);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");

  // SEFAZ Simulator states
  const [simStoreId, setSimStoreId] = useState("s1");
  const [simProductId, setSimProductId] = useState("p1");
  const [simQty, setSimQty] = useState("10");
  const [simPrice, setSimPrice] = useState("250.00");
  const [simType, setSimType] = useState<"nfe" | "nfce">("nfe");
  const [expandedXmlId, setExpandedXmlId] = useState<string | null>(null);
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSaveProfile = () => {
    toast({ title: "Perfil atualizado", description: "Suas informações foram salvas." });
  };

  const handleAddCard = () => {
    if (cardNumber.length < 4) {
      toast({ title: "Número inválido", description: "Verifique os dados do cartão.", variant: "destructive" });
      return;
    }
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);
    setCards([...cards, { id: Date.now().toString(), brand: "Cartão", last4 }]);
    setCardNumber(""); setCardName(""); setCardExpiry(""); setCardCvv("");
    setShowAddCard(false);
    toast({ title: "Cartão adicionado", description: `Final ${last4} cadastrado.` });
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
    toast({ title: "Cartão removido" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 text-left">
          <SheetTitle>Conta e Configurações</SheetTitle>
          <SheetDescription>Gerencie seu perfil e métodos de pagamento</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="profile" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4 h-10 rounded-xl bg-secondary p-1">
              <TabsTrigger value="profile" className="rounded-lg gap-1.5 data-[state=active]:bg-card text-xs">
                <User size={14} /> Perfil
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg gap-1.5 data-[state=active]:bg-card text-xs">
                <Package size={14} /> Pedidos
              </TabsTrigger>
              <TabsTrigger value="wallet" className="rounded-lg gap-1.5 data-[state=active]:bg-card text-xs">
                <CreditCard size={14} /> Carteira
              </TabsTrigger>
              <TabsTrigger value="sefaz" className="rounded-lg gap-1.5 data-[state=active]:bg-card text-xs">
                <FileText size={14} /> SEFAZ
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="flex-1 overflow-y-auto px-6 py-5 mt-0 space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera size={16} />
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="acc-name">Nome completo</Label>
                <Input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-email">E-mail</Label>
                <Input id="acc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-phone">Telefone</Label>
                <Input id="acc-phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-cpf">CPF/Documento</Label>
                <Input id="acc-cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} maxLength={20} />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Tipo de Perfil</h3>
                <p className="text-xs text-muted-foreground">Defina como você usa o Near Me</p>
              </div>
              <RadioGroup
                value={profileType}
                onValueChange={(v) => setProfileType(v as ProfileType)}
                className="space-y-2"
              >
                {[
                  { v: "common", label: "Usuário Comum", desc: "Apenas busca produtos" },
                  { v: "business", label: "Dono de Comércio", desc: "Cadastra produtos da sua loja" },
                ].map((opt) => (
                  <label
                    key={opt.v}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      profileType === opt.v ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={opt.v} className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              {profileType === "business" && (
                <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
                  <div className="space-y-1.5">
                    <Label htmlFor="biz-name">Nome do comércio</Label>
                    <Input id="biz-name" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} maxLength={100} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="biz-address">Endereço do comércio</Label>
                    <Input id="biz-address" value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} maxLength={200} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="biz-hours">Horário de funcionamento</Label>
                    <Input id="biz-hours" value={business.hours} onChange={(e) => setBusiness({ ...business, hours: e.target.value })} maxLength={100} placeholder="Seg-Sex 09h-18h" />
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handleSaveProfile} className="w-full h-11 rounded-xl font-semibold">
              Salvar Alterações
            </Button>
          </TabsContent>

          <TabsContent value="orders" className="flex-1 overflow-y-auto px-6 py-5 mt-0 space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Package size={36} className="mx-auto text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
                <p className="text-xs text-muted-foreground">Seus pedidos aparecerão aqui após o pagamento.</p>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="p-4 rounded-xl bg-secondary border border-border space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {o.items[0]?.name ?? "Pedido"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{o.storeName}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(o.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-muted-foreground">Código</p>
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                        {o.code}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 rounded-lg"
                      onClick={() => setSelectedOrder(o)}
                    >
                      Ver QR Code
                    </Button>
                    <button
                      onClick={() => {
                        removeOrder(o.id);
                        toast({ title: "Pedido removido" });
                      }}
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remover pedido"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="wallet" className="flex-1 overflow-y-auto px-6 py-5 mt-0 space-y-4">
            <div className="space-y-2">
              {cards.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum cartão cadastrado.</p>
              ) : (
                cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{card.brand}</p>
                        <p className="text-xs text-muted-foreground">com final {card.last4}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCard(card.id)}
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remover cartão"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {showAddCard ? (
              <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
                <div className="space-y-1.5">
                  <Label htmlFor="c-number">Número do cartão</Label>
                  <Input id="c-number" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength={19} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-name">Nome impresso</Label>
                  <Input id="c-name" placeholder="MARIA SILVA" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} maxLength={50} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="c-exp">Validade</Label>
                    <Input id="c-exp" placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} maxLength={5} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="c-cvv">CVV</Label>
                    <Input id="c-cvv" inputMode="numeric" placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} maxLength={4} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddCard(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1 rounded-xl font-semibold" onClick={handleAddCard}>
                    Cadastrar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowAddCard(true)}
                variant="outline"
                className="w-full h-12 rounded-xl border-dashed border-2 gap-2 text-primary hover:bg-primary/5 hover:text-primary"
              >
                <Plus size={18} /> Adicionar Novo Cartão
              </Button>
            )}
          </TabsContent>

          <TabsContent value="sefaz" className="flex-1 overflow-y-auto px-6 py-5 mt-0 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Painel SEFAZ API (Simulador)</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Simule notas fiscais para atualizar o estoque e preços no app
              </p>
            </div>

            <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-slate-100 dark:bg-white/5">
                <button
                  type="button"
                  onClick={() => { setSimType("nfe"); setSimPrice("150.00"); }}
                  className={`py-1.5 rounded-full text-xs font-semibold transition-all ${
                    simType === "nfe"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  NF-e (Compra/Entrada)
                </button>
                <button
                  type="button"
                  onClick={() => { setSimType("nfce"); setSimPrice("289.90"); }}
                  className={`py-1.5 rounded-full text-xs font-semibold transition-all ${
                    simType === "nfce"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  NFC-e (Venda/Saída)
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-store">Estabelecimento / Loja</Label>
                <select
                  id="sim-store"
                  value={simStoreId}
                  onChange={(e) => setSimStoreId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-product">Produto</Label>
                <select
                  id="sim-product"
                  value={simProductId}
                  onChange={(e) => setSimProductId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sim-qty">Quantidade</Label>
                  <Input
                    id="sim-qty"
                    type="number"
                    value={simQty}
                    onChange={(e) => setSimQty(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sim-price">
                    {simType === "nfe" ? "Preço de Custo (R$)" : "Preço de Venda (R$)"}
                  </Label>
                  <Input
                    id="sim-price"
                    type="number"
                    step="0.01"
                    value={simPrice}
                    onChange={(e) => setSimPrice(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  const qty = parseInt(simQty);
                  const price = parseFloat(simPrice);
                  if (isNaN(qty) || qty <= 0 || isNaN(price) || price < 0) {
                    toast({ title: "Valores inválidos", variant: "destructive" });
                    return;
                  }
                  if (simType === "nfe") {
                    simulateNfeReceipt(simStoreId, simProductId, qty, price);
                    toast({ title: "Nota de Entrada Processada", description: `Adicionado ${qty} unidades ao estoque.` });
                  } else {
                    simulateNfceSale(simStoreId, simProductId, qty, price);
                    toast({ title: "Nota de Saída Processada", description: `Vendido ${qty} unidades. Novo preço: R$ ${price.toFixed(2)}.` });
                  }
                }}
                className="w-full h-11 rounded-xl font-semibold"
              >
                {simType === "nfe" ? "Processar Entrada (NF-e)" : "Processar Venda (NFC-e)"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Logs de Documentos Fiscais</h4>
                {invoiceLogs.length > 0 && (
                  <button onClick={clearLogs} className="text-xs text-destructive hover:underline">
                    Limpar
                  </button>
                )}
              </div>

              {invoiceLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Nenhuma nota emitida ainda.</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {invoiceLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-secondary rounded-xl border border-border space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              log.type === "NF-e"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            }`}
                          >
                            {log.type}
                          </span>
                          <p className="text-xs font-semibold text-foreground mt-1">{log.storeName}</p>
                          <p className="text-xs text-muted-foreground">{log.productName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-foreground">
                            {log.type === "NF-e" ? "+" : "-"}{log.quantity} un
                          </p>
                          <p className="text-xs text-muted-foreground">
                            R$ {log.price.toFixed(2).replace(".", ",")} /un
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>{log.timestamp.toLocaleTimeString()}</span>
                        <button
                          onClick={() => setExpandedXmlId(expandedXmlId === log.id ? null : log.id)}
                          className="text-primary hover:underline"
                        >
                          {expandedXmlId === log.id ? "Esconder XML" : "Ver XML Fiscal"}
                        </button>
                      </div>

                      {expandedXmlId === log.id && (
                        <pre className="text-[9px] p-2 bg-slate-900 text-slate-200 rounded-md overflow-x-auto whitespace-pre font-mono max-h-[150px]">
                          {log.xmlMock}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
      <OrderSuccessModal
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Sheet>
  );
};

export default AccountSheet;
