"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/app/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
        <Image
              src="/logo.png" 
              alt="PaperTrail Logo" 
              width={32} 
              height={32}
              className="square-md"
            />
            <span className="font-bold text-xl">PaperTrail</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-1/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              ⚡ Powered by Advanced RAG Technology
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
              Research-Grounded{" "}
              <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-3 bg-clip-text text-transparent">
                Conversational AI
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Ask questions about cutting-edge research. Get accurate, citation-backed answers 
              from <strong>PubMed</strong> and <strong>arXiv</strong> in real-time with streaming responses.
            </p>

            <div className="flex justify-center pt-4">
              <Button size="lg" className="text-lg px-8 h-12" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>

            {/* Demo Preview */}
            <div className="pt-12 w-full max-w-5xl">
              <Card className="border-2 shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="bg-muted/30 border-b px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/70" />
                    <div className="w-3 h-3 rounded-full bg-chart-4/70" />
                    <div className="w-3 h-3 rounded-full bg-chart-2/70" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">PaperTrail Chat</span>
                </div>
                <CardContent className="p-8 space-y-4 bg-gradient-to-br from-background to-muted/20">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                      U
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">What are the latest breakthroughs in mRNA vaccine development?</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chart-1 to-chart-3 flex items-center justify-center text-sm text-white">
                      AI
                    </div>
                    <div className="flex-1 bg-card border rounded-lg p-4 space-y-2">
                      <p className="text-sm leading-relaxed">
                        Recent studies show significant advances in mRNA vaccine stability and delivery mechanisms...
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="outline" className="text-xs">📄 PMID: 38234567</Badge>
                        <Badge variant="outline" className="text-xs">📄 arXiv: 2401.12345</Badge>
                        <Badge variant="outline" className="text-xs">📊 Export PDF</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for research-backed conversations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <CardTitle>RAG-Powered Answers</CardTitle>
                <CardDescription>
                  Retrieval-Augmented Generation combines the best of vector search and LLMs for accurate, grounded responses.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle>Real-Time Streaming</CardTitle>
                <CardDescription>
                  Watch answers appear token-by-token with beautiful Markdown formatting, code blocks, and mathematical equations.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <CardTitle>Citation Tracking</CardTitle>
                <CardDescription>
                  Every claim is backed by sources. Get PMIDs, arXiv IDs, and direct links to original papers.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">📥</span>
                </div>
                <CardTitle>File Downloads</CardTitle>
                <CardDescription>
                  Export answers as PDF, Markdown, or Text. Download references as CSV or bundled source PDFs.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-5/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">📤</span>
                </div>
                <CardTitle>Upload Your Docs</CardTitle>
                <CardDescription>
                  Drop in your own PDFs and documents. They&apos;re instantly indexed and become part of the knowledge base.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">🕐</span>
                </div>
                <CardTitle>Conversation History</CardTitle>
                <CardDescription>
                  Never lose a chat. All conversations are saved with full context, citations, and downloadable artifacts.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to research-backed answers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold z-10 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold">Ask Your Question</h3>
              <p className="text-muted-foreground">
                Type your research question in natural language. Ask about any scientific topic.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold z-10 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold">AI Searches & Retrieves</h3>
              <p className="text-muted-foreground">
                Our RAG system searches millions of papers from PubMed and arXiv to find relevant sources.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold z-10 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold">Get Cited Answer</h3>
              <p className="text-muted-foreground">
                Receive a comprehensive answer with full citations, exportable files, and source links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Researchers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what scientists and researchers are saying about PaperTrail
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {/* Testimonial 1 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center text-white font-semibold text-lg">
                          DS
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Dr. Sarah Mitchell</h4>
                          <p className="text-sm text-muted-foreground">
                            Computational Biologist, MIT
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex gap-1 text-chart-4">
                          {"★★★★★".split("").map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          &quot;PaperTrail has revolutionized my literature review process. The citation tracking
                          and instant access to PubMed papers saves me hours every week.&quot;
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>

                {/* Testimonial 2 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-3 to-chart-4 flex items-center justify-center text-white font-semibold text-lg">
                          JC
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Prof. James Chen</h4>
                          <p className="text-sm text-muted-foreground">
                            AI Researcher, Stanford
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex gap-1 text-chart-4">
                          {"★★★★★".split("").map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          &quot;The RAG-powered answers are incredibly accurate. Being able to export everything
                          as PDFs with citations is a game-changer for grant writing.&quot;
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>

                {/* Testimonial 3 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-5 to-chart-1 flex items-center justify-center text-white font-semibold text-lg">
                          MR
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Dr. Maria Rodriguez</h4>
                          <p className="text-sm text-muted-foreground">
                            Physics PhD Candidate, CERN
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex gap-1 text-chart-4">
                          {"★★★★★".split("").map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          &quot;arXiv integration is brilliant! I can stay up-to-date with the latest preprints
                          and get summaries instantly. This is the future of research.&quot;
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>

                {/* Testimonial 4 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-2 to-chart-3 flex items-center justify-center text-white font-semibold text-lg">
                          AP
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Dr. Aisha Patel</h4>
                          <p className="text-sm text-muted-foreground">
                            Medical Researcher, Johns Hopkins
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex gap-1 text-chart-4">
                          {"★★★★★".split("").map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          &quot;Finally, an AI tool that actually understands research! The streaming responses
                          and citation links make it feel like having a research assistant.&quot;
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>

                {/* Testimonial 5 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-4 to-chart-5 flex items-center justify-center text-white font-semibold text-lg">
                          TN
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Thomas Nielsen</h4>
                          <p className="text-sm text-muted-foreground">
                            Data Scientist, Google Research
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex gap-1 text-chart-4">
                          {"★★★★★".split("").map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          &quot;The ability to upload my own papers and have them indexed immediately is incredible.
                          It&apos;s like having my own private research knowledge base.&quot;
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>

                {/* Testimonial 6 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center text-white font-semibold text-lg">
                          LK
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Dr. Lisa Kowalski</h4>
                          <p className="text-sm text-muted-foreground">
                            Neuroscience Professor, Oxford
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex gap-1 text-chart-4">
                          {"★★★★★".split("").map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          &quot;Clean interface, powerful features, and most importantly—accurate citations.
                          This is exactly what the academic community needs.&quot;
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
          <Image
                src="/logo.png" 
                alt="PaperTrail Logo" 
                width={24} 
                height={24}
                className="square-md"
              />
              <span className="font-semibold">PaperTrail</span>
              <span className="text-muted-foreground text-sm ml-2">© 2025</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}