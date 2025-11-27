import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-boxing.jpg";

interface Program {
  id: string;
  city: string;
  date: string;
  time: string;
  maps_link: string;
  created_at: string;
}

const Index = () => {
  const { data: programs, isLoading } = useQuery({
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Aura Boxing" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            AURA BOXING
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Find Your Power. Find Your Program.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 text-lg shadow-strong animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
            onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Programs
          </Button>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wide">
              UPCOMING PROGRAMS
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : programs && programs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="group bg-card border-2 border-border hover:border-primary rounded-xl overflow-hidden shadow-card hover:shadow-strong transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-hero p-6 text-white">
                    <h3 className="font-display text-2xl font-bold mb-2 tracking-wide">
                      {program.city.toUpperCase()}
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-foreground">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        {format(new Date(program.date), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-foreground">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{program.time}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all"
                      onClick={() => window.open(program.maps_link, "_blank")}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View Location
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No programs scheduled yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-display text-2xl font-bold mb-2 tracking-wider">AURA BOXING</p>
          <p className="text-white/70">Building Champions, One Round at a Time</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
