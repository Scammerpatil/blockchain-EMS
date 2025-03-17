import { createContext, useState, useContext, ReactNode } from "react";
import { PoliceStation } from "@/types/PoliceStation";

interface AuthContextType {
  policeStation: PoliceStation | null;
  setPoliceStation: React.Dispatch<React.SetStateAction<PoliceStation | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [policeStation, setPoliceStation] = useState<PoliceStation | null>(
    null
  );

  return (
    <AuthContext.Provider value={{ policeStation, setPoliceStation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
