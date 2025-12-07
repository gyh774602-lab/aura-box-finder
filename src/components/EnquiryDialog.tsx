import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

interface EnquiryDialogProps {
    programId: string;
    programCity: string;
}

const EnquiryDialog = ({ programId, programCity }: EnquiryDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const submitEnquiryMutation = useMutation({
        mutationFn: async (e: React.FormEvent) => {
            e.preventDefault();
            const { error } = await supabase.from("enquiries").insert([
                {
                    program_id: programId,
                    name,
                    phone,
                    email: email || null,
                },
            ]);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Enquiry sent successfully! We'll contact you soon.");
            setIsOpen(false);
            setName("");
            setPhone("");
            setEmail("");
        },
        onError: () => {
            toast.error("Failed to send enquiry. Please try again.");
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white font-bold transition-all shadow-md">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enquire Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display font-bold text-center tracking-wide">
                        ENQUIRE FOR {programCity.toUpperCase()}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={submitEnquiryMutation.mutate} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-right font-semibold">
                            Name *
                        </Label>
                        <Input
                            id="name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-2 focus:border-primary"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-right font-semibold">
                            Phone Number *
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border-2 focus:border-primary"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-right font-semibold">
                            Email (Optional)
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-2 focus:border-primary"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg shadow-strong mt-4"
                        disabled={submitEnquiryMutation.isPending}
                    >
                        {submitEnquiryMutation.isPending ? "Sending..." : "Submit Enquiry"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EnquiryDialog;
