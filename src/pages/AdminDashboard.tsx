import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Calendar, Clock, MapPin, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface Program {
  id: string;
  city: string;
  date: string;
  time: string;
  maps_link: string;
  created_at: string;
}

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
  program: {
    city: string;
    date: string;
  } | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mapsLink, setMapsLink] = useState("");

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const { data: programs } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data as Program[];
    },
  });

  const { data: enquiries } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select(`
          *,
          program:programs(city, date)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Enquiry[];
    },
  });

  const addProgramMutation = useMutation({
    mutationFn: async (newProgram: { city: string; date: string; time: string; maps_link: string }) => {
      const { error } = await supabase.from("programs").insert([newProgram]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program added successfully!");
      setCity("");
      setDate("");
      setTime("");
      setMapsLink("");
    },
    onError: () => {
      toast.error("Failed to add program");
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("programs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete program");
    },
  });

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    navigate("/admin");
    toast.success("Logged out successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProgramMutation.mutate({ city, date, time, maps_link: mapsLink });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-wider">
            ADMIN DASHBOARD
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-secondary"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Add Program Form */}
        <section className="mb-12">
          <div className="bg-card border-2 border-border rounded-xl p-6 md:p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" />
              ADD NEW PROGRAM
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="city" className="font-semibold">City Name</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="border-2 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="font-semibold">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-2 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time" className="font-semibold">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border-2 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="mapsLink" className="font-semibold">Google Maps Link</Label>
                  <Input
                    id="mapsLink"
                    type="url"
                    value={mapsLink}
                    onChange={(e) => setMapsLink(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="border-2 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 shadow-strong"
                disabled={addProgramMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                {addProgramMutation.isPending ? "Adding..." : "Add Program"}
              </Button>
            </form>
          </div>
        </section>

        {/* Programs List */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            SCHEDULED PROGRAMS
          </h2>

          {programs && programs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-card border-2 border-border rounded-xl p-6 shadow-card hover:shadow-strong transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {program.city.toUpperCase()}
                    </h3>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProgramMutation.mutate(program.id)}
                      disabled={deleteProgramMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{format(new Date(program.date), "MMMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{program.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <a
                        href={program.maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        View on Maps
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-xl">
              <p className="text-muted-foreground">No programs scheduled yet.</p>
            </div>
          )}
        </section>

        {/* Enquiries Section */}
        <section className="mt-12 mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            PARTICIPANT ENQUIRIES
          </h2>

          <div className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Contact</th>
                    <th className="p-4 text-left">Program</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enquiries && enquiries.length > 0 ? (
                    enquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 text-foreground/80">
                          {format(new Date(enquiry.created_at), "MMM d, yyyy")}
                        </td>
                        <td className="p-4 font-semibold text-foreground">
                          {enquiry.name}
                        </td>
                        <td className="p-4 text-foreground/80">
                          <div className="flex flex-col">
                            <span className="font-medium text-primary">{enquiry.phone}</span>
                            {enquiry.email && (
                              <span className="text-sm text-muted-foreground">{enquiry.email}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-foreground/80">
                          {enquiry.program ? (
                            <div className="flex flex-col">
                              <span className="font-bold">{enquiry.program.city.toUpperCase()}</span>
                              <span className="text-sm">
                                {format(new Date(enquiry.program.date), "MMM d")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Deleted Program</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        No enquiries received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
