import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AccountSheet from "@/components/AccountSheet";

interface Props {
  initials?: string;
  imageUrl?: string;
}

const AccountAvatarButton = ({ initials = "MS", imageUrl }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full ring-2 ring-transparent hover:ring-primary/30 transition-all"
        aria-label="Abrir conta e configurações"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={imageUrl} alt="Perfil" />
          <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>
      <AccountSheet open={open} onOpenChange={setOpen} />
    </>
  );
};

export default AccountAvatarButton;
