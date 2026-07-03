import { useEffect, useState } from "react";
import { Store, Truck, Wallet, CreditCard, Smartphone, Banknote, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Store as StoreType } from "@/data/mockData";
import OrderSuccessModal from "./OrderSuccessModal";
import { useOrders, type Order } from "@/hooks/useOrders";

type FulfillmentMethod = "pickup" | "delivery";
type PaymentMethod = "on_site" | "on_delivery" | "in_app";
type AppPayment = "pix" | "credit" | "debit";

interface PurchaseModalProps {
  store: (StoreType & { matchedProduct: { name: string; price: number } }) | null;
  onClose: () => void;
}

const PurchaseModal = ({ store, onClose }: PurchaseModalProps) => {
  const open = !!store;

  const defaultFulfillment: FulfillmentMethod = store?.supportsPickup
    ? "pickup"
    : "delivery";

  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>(defaultFulfillment);
  const [payment, setPayment] = useState<PaymentMethod>("on_site");
  const [appPayment, setAppPayment] = useState<AppPayment>("pix");
  const [step, setStep] = useState<"order" | "payment">("order");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { addOrder } = useOrders();

  useEffect(() => {
    if (store) {
      const f: FulfillmentMethod = store.supportsPickup ? "pickup" : "delivery";
      setFulfillment(f);
      setPayment(f === "pickup" ? "on_site" : "on_delivery");
      setAppPayment("pix");
      setStep("order");
    }
  }, [store]);

  if (!store) return null;

  const handleFulfillmentChange = (val: FulfillmentMethod) => {
    setFulfillment(val);
    if (val === "pickup" && payment === "on_delivery") setPayment("on_site");
    if (val === "delivery" && payment === "on_site") setPayment("on_delivery");
  };

  const productPrice = store.matchedProduct.price;
  const deliveryFee = fulfillment === "delivery" ? store.deliveryFee : 0;
  const total = productPrice + deliveryFee;

  const handleProceedToPayment = () => setStep("payment");

  const handleConfirmPayment = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const saved = addOrder({
      code,
      storeName: store.name,
      storeAddress: store.address,
      items: [{ name: store.matchedProduct.name, price: productPrice }],
      deliveryFee,
      total,
      fulfillment,
    });
    setCurrentOrder(saved);
    toast.success("Pagamento confirmado!");
  };

  const handleCloseAll = () => {
    setCurrentOrder(null);
    onClose();
  };

  const formatBRL = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[92vh] overflow-y-auto p-0 flex flex-col"
      >
        <SheetHeader className="text-left px-6 pt-6 pb-3">
          <SheetTitle className="text-xl">{store.matchedProduct.name}</SheetTitle>
          <SheetDescription className="flex items-center gap-1.5 text-xs">
            <MapPin size={12} /> {store.name} · {store.distanceKm} km
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-4 space-y-6 flex-1" hidden={step !== "order"}>
          {/* Step 1: Fulfillment */}
          <section>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Como você deseja o produto?
            </h3>
            <RadioGroup
              value={fulfillment}
              onValueChange={(v) => handleFulfillmentChange(v as FulfillmentMethod)}
              className="grid grid-cols-2 gap-3"
            >
              <OptionCard
                value="pickup"
                icon={<Store size={20} />}
                label="Retirar na Loja"
                disabled={!store.supportsPickup}
                checked={fulfillment === "pickup"}
              />
              <OptionCard
                value="delivery"
                icon={<Truck size={20} />}
                label="Pedir para Entregar"
                sublabel={
                  store.supportsDelivery
                    ? `Entrega ${formatBRL(store.deliveryFee)}`
                    : "Indisponível"
                }
                disabled={!store.supportsDelivery}
                checked={fulfillment === "delivery"}
              />
            </RadioGroup>
          </section>

          {/* Step 2: Payment */}
          <section>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Forma de pagamento
            </h3>
            <RadioGroup
              value={payment}
              onValueChange={(v) => setPayment(v as PaymentMethod)}
              className="space-y-2"
            >
              {fulfillment === "pickup" && (
                <PaymentRow
                  value="on_site"
                  icon={<Banknote size={18} />}
                  label="Pagar no Local"
                  checked={payment === "on_site"}
                />
              )}
              {fulfillment === "delivery" && (
                <PaymentRow
                  value="on_delivery"
                  icon={<Banknote size={18} />}
                  label="Pagar na Entrega"
                  checked={payment === "on_delivery"}
                />
              )}
              <PaymentRow
                value="in_app"
                icon={<Wallet size={18} />}
                label="Pagar pelo App"
                checked={payment === "in_app"}
              />

              {payment === "in_app" && (
                <div className="ml-7 pl-3 border-l-2 border-primary/30 space-y-2 pt-1">
                  <Label className="text-xs text-muted-foreground">
                    Escolha o método
                  </Label>
                  <Select
                    value={appPayment}
                    onValueChange={(v) => setAppPayment(v as AppPayment)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">
                        <span className="flex items-center gap-2">
                          <Smartphone size={14} /> PIX
                        </span>
                      </SelectItem>
                      <SelectItem value="credit">
                        <span className="flex items-center gap-2">
                          <CreditCard size={14} /> Cartão de Crédito
                        </span>
                      </SelectItem>
                      <SelectItem value="debit">
                        <span className="flex items-center gap-2">
                          <CreditCard size={14} /> Cartão de Débito
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </RadioGroup>
          </section>
        </div>

        {step === "payment" && (
          <div className="px-6 pb-4 space-y-4 flex-1">
            <section className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-medium">
                <Smartphone size={14} /> Pagamento via Pix
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Escaneie o QR Code para pagar
              </h3>
              <p className="text-xs text-muted-foreground">
                Após confirmar o pagamento, você receberá o código de retirada.
              </p>
            </section>

            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-xl border-2 border-blue-900/20">
                <div className="w-40 h-40 grid grid-cols-8 grid-rows-8 gap-0.5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={
                        (i * 7) % 3 === 0 ? "bg-blue-900" : "bg-white"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">Valor total</p>
              <p className="text-2xl font-bold text-foreground">{formatBRL(total)}</p>
            </div>
          </div>
        )}

        <SheetFooter className="px-6 pb-6 pt-4 border-t border-border bg-card flex-col gap-3 sm:flex-col">
          {step === "order" && (
            <div className="w-full space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Produto</span>
                <span>{formatBRL(productPrice)}</span>
              </div>
              {fulfillment === "delivery" && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Entrega</span>
                  <span>{formatBRL(deliveryFee)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base text-foreground">
                <span>Total</span>
                <span>{formatBRL(total)}</span>
              </div>
            </div>
          )}
          {step === "order" ? (
            <Button
              onClick={handleProceedToPayment}
              className="w-full h-12 rounded-xl text-base font-semibold"
            >
              Pagar
            </Button>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <Button
                onClick={handleConfirmPayment}
                className="w-full h-12 rounded-xl text-base font-semibold"
              >
                Confirmar Pagamento
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep("order")}
                className="w-full h-10 rounded-xl"
              >
                Voltar
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
      <OrderSuccessModal
        open={!!currentOrder}
        order={currentOrder}
        onClose={handleCloseAll}
      />
    </Sheet>
  );
};

interface OptionCardProps {
  value: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  checked: boolean;
}

const OptionCard = ({ value, icon, label, sublabel, disabled, checked }: OptionCardProps) => (
  <Label
    htmlFor={`fulfillment-${value}`}
    className={`flex flex-col items-start gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
      disabled
        ? "opacity-50 cursor-not-allowed border-border"
        : checked
        ? "border-primary bg-primary/5"
        : "border-border hover:border-primary/50"
    }`}
  >
    <div className="flex items-center justify-between w-full">
      <span className={checked ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <RadioGroupItem
        value={value}
        id={`fulfillment-${value}`}
        disabled={disabled}
        className="h-4 w-4"
      />
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
    </div>
  </Label>
);

interface PaymentRowProps {
  value: string;
  icon: React.ReactNode;
  label: string;
  checked: boolean;
}

const PaymentRow = ({ value, icon, label, checked }: PaymentRowProps) => (
  <Label
    htmlFor={`pay-${value}`}
    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
      checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
    }`}
  >
    <RadioGroupItem value={value} id={`pay-${value}`} className="h-4 w-4" />
    <span className={checked ? "text-primary" : "text-muted-foreground"}>{icon}</span>
    <span className="text-sm font-medium text-foreground">{label}</span>
  </Label>
);

export default PurchaseModal;
