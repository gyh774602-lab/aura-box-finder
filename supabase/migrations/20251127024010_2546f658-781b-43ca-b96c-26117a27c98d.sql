-- Create programs table to store Aura Boxing program locations
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  maps_link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (anyone can view programs)
CREATE POLICY "Anyone can view programs" 
ON public.programs 
FOR SELECT 
USING (true);

-- Create policy to allow public insert (admin will be password-protected in app)
CREATE POLICY "Anyone can insert programs" 
ON public.programs 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public updates
CREATE POLICY "Anyone can update programs" 
ON public.programs 
FOR UPDATE 
USING (true);

-- Create policy to allow public deletes
CREATE POLICY "Anyone can delete programs" 
ON public.programs 
FOR DELETE 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_programs_date ON public.programs(date DESC);