import { createContext, useContext, useState, type ReactNode } from "react";

export type ProfileType = "common" | "business";

export interface BusinessInfo {
  name: string;
  address: string;
  hours: string;
}

interface UserProfileContextValue {
  profileType: ProfileType;
  setProfileType: (t: ProfileType) => void;
  business: BusinessInfo;
  setBusiness: (b: BusinessInfo) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileType, setProfileType] = useState<ProfileType>("common");
  const [business, setBusiness] = useState<BusinessInfo>({ name: "", address: "", hours: "" });

  return (
    <UserProfileContext.Provider
      value={{ profileType, setProfileType, business, setBusiness }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
};
