import { useState, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";

type SaleType = "personal" | "business";

const CreateListingFAB = () => {
  const [open, setOpen] = useState(false);
  const { business } = useUserProfile();

  // Product form
  const [productImage, setProductImage] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [saleType, setSaleType] = useState<SaleType>("personal");
  const [productAddress, setProductAddress] = useState("");

  useEffect(() => {
    if (saleType === "business" && business.address) {
      setProductAddress(business.address);
    }
  }, [saleType, business.address]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProductImage(URL.createObjectURL(file));
  };

  const resetProduct = () => {
    setProductImage(""); setProductName(""); setProductPrice("");
    setSaleType("personal"); setProductAddress("");
  };

  const handlePublishProduct = () => {
    if (!productName.trim() || !productPrice.trim()) {
      toast({ title: "Preencha os campos", description: "Nome e preço são obrigatórios.", variant: "destructive" });
      return;
    }
    if (saleType === "personal" && !productAddress.trim()) {
      toast({ title: "Endereço obrigatório", description: "Informe onde o produto está localizado.", variant: "destructive" });
      return;
    }
    toast({ title: "Produto publicado", description: `${productName} foi anunciado com sucesso.` });
    resetProduct();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Criar novo anúncio"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[92vh] p-0 flex flex-col rounded-t-3xl">
          <SheetHeader className="px-6 pt-6 pb-3 text-left">
            <SheetTitle>Novo anúncio</SheetTitle>
            <SheetDescription>Cadastre um produto no Near Me</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label>Foto do produto <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <label
                htmlFor="product-image"
                className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-border bg-secondary/40 cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
              >
                {productImage ? (
                  <img src={productImage} alt="Pré-visualização" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <Upload size={20} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Toque para enviar imagem</span>
                  </>
                )}
                <input id="product-image" type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-name">Nome do produto</Label>
              <Input id="p-name" value={productName} onChange={(e) => setProductName(e.target.value)} maxLength={100} placeholder="Ex: Pneu aro 15" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-price">Preço (R$)</Label>
              <Input id="p-price" inputMode="decimal" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} maxLength={15} placeholder="0,00" />
            </div>

            <div className="space-y-2">
              <Label>Tipo de venda</Label>
              <RadioGroup value={saleType} onValueChange={(v) => setSaleType(v as SaleType)} className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${saleType === "personal" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="personal" />
                  <span className="text-sm font-medium">Venda Pessoal</span>
                </label>
                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${saleType === "business" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="business" />
                  <span className="text-sm font-medium">Comércio</span>
                </label>
              </RadioGroup>
            </div>

            {saleType === "business" ? (
              <div className="rounded-xl border border-border bg-secondary/40 p-3 text-sm">
                {business.name || business.address ? (
                  <>
                    <p className="font-semibold text-foreground">{business.name || "Meu comércio"}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{business.address || "Endereço não cadastrado"}</p>
                    {business.hours && <p className="text-muted-foreground text-xs mt-0.5">{business.hours}</p>}
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Cadastre seu comércio em Conta &gt; Tipo de Perfil para preencher automaticamente.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="p-address">Endereço do produto</Label>
                <Input id="p-address" value={productAddress} onChange={(e) => setProductAddress(e.target.value)} maxLength={200} placeholder="Rua, número, bairro" />
              </div>
            )}

            <div className="pt-2">
              <Button onClick={handlePublishProduct} className="w-full h-12 rounded-xl font-semibold">
                Publicar Produto
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateListingFAB;
