import { Copy, MapPin, X, Navigation } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import type { Order } from "@/hooks/useOrders";

interface OrderSuccessModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

const formatBRL = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

const OrderSuccessModal = ({ open, order, onClose }: OrderSuccessModalProps) => {
  if (!order) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.code);
      toast.success("Código copiado!");
    } catch {
      toast.error("Falha ao copiar");
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${order.storeName} ${order.storeAddress}`,
  )}`;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden [&>button]:hidden max-h-[92vh] overflow-y-auto">
        <div className="relative px-6 pt-6 pb-2">
          <DialogTitle className="text-center text-lg font-semibold">
            Pedido Confirmado
          </DialogTitle>
          <p className="text-center text-xs text-muted-foreground mt-1">
            Use o código ou QR Code abaixo para retirar.
          </p>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="text-center">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                Código:
              </p>
              <p className="text-3xl font-bold tracking-widest text-blue-700 dark:text-blue-400 tabular-nums">
                {order.code}
              </p>
            </div>
            <button
              onClick={handleCopy}
              aria-label="Copiar código"
              className="p-2 rounded-lg text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              <Copy size={20} />
            </button>
          </div>

          <Separator />

          <p className="text-center text-sm text-muted-foreground">
            Apresente para retirada:
          </p>

          <div className="flex justify-center py-2">
            <div className="p-4 bg-white rounded-xl border-2 border-blue-900/20">
              <QRCodeCanvas
                value={order.code}
                size={180}
                bgColor="#ffffff"
                fgColor="#1e3a8a"
                level="M"
              />
            </div>
          </div>

          {/* Pickup info card */}
          <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-blue-700 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Ponto de Retirada</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {order.storeName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {order.storeAddress}
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full rounded-lg gap-2"
            >
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                <Navigation size={14} /> Ver no Maps
              </a>
            </Button>
          </div>

          {/* Optional summary accordion */}
          <Accordion type="single" collapsible className="rounded-xl border border-border px-4">
            <AccordionItem value="items" className="border-0">
              <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                Ver detalhes dos itens
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground">{formatBRL(item.price)}</span>
                  </div>
                ))}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entrega</span>
                    <span className="text-foreground">{formatBRL(order.deliveryFee)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-sm">
                  <span>Total</span>
                  <span className="text-blue-700 dark:text-blue-400">
                    {formatBRL(order.total)}
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            onClick={onClose}
            className="w-full h-11 rounded-xl"
          >
            Concluído
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
