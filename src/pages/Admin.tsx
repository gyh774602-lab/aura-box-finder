import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_PASSWORD = "6282065969";

const Admin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      navigate("/admin/dashboard");
      toast.success("Access granted!");
    } else {
      toast.error("Invalid password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-bold text-foreground mb-2 tracking-wider">
            ADMIN ACCESS
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>

        <form onSubmit={handleLogin} className="bg-card border-2 border-border rounded-xl p-8 shadow-card">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-lg font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="mt-2 border-2 focus:border-primary"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg shadow-strong"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
