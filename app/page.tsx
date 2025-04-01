"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, ChevronRight, Lock, PieChart, Shield, Bitcoin, TrendingUp, Globe, Users, Lightbulb, Target, GraduationCap, Headphones, BookOpen, Calculator, Mail, Phone, MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

// Configuration du formulaire de contact avec Resend
export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Erreur lors de l'envoi")

      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Bitcoin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Bitsway</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#services" className="text-sm font-medium hover:underline underline-offset-4">
              Services
            </Link>
            <Link href="#benefits" className="text-sm font-medium hover:underline underline-offset-4">
              Avantages
            </Link>
            <Link href="#expertise" className="text-sm font-medium hover:underline underline-offset-4">
              Notre Expertise
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <Button>Prendre Rendez-vous</Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/bitcoin-hero.jpg"
              alt="Bitcoin Treasury"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
          </div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                    Nouvelle ère de la trésorerie
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-2">
                    Protégez et optimisez votre trésorerie avec Bitcoin
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Nous accompagnons les entreprises dans la gestion de leur capital en intégrant Bitcoin comme actif
                    stratégique.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">
                    Découvrir nos solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    En savoir plus
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-3xl" />
                <div className="relative rounded-2xl overflow-hidden aspect-square">
                  <Image
                    src="/images/bitcoin-hero-right.jpg"
                    alt="Bitcoin Treasury"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </section>
        <section id="benefits" className="w-full py-6 md:py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-primary/10 to-transparent opacity-50 z-0" />
            <div className="absolute inset-0 bg-grid-black/[0.02] z-0" />
          </div>
          <div className="container px-4 md:px-6 relative z-20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                Avantages
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-2">
                Pourquoi intégrer Bitcoin dans votre trésorerie ?
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Le Bitcoin offre des avantages stratégiques pour les entreprises cherchant à protéger leur capital.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-3">
                <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Protection contre l'inflation</h3>
                    <p className="text-muted-foreground text-sm">
                      Préservez la valeur de votre trésorerie face à la dépréciation monétaire.
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Diversification du portefeuille</h3>
                    <p className="text-muted-foreground text-sm">
                      Réduisez les risques en diversifiant vos actifs avec une classe d'actif décorrélée.
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Potentiel de croissance</h3>
                    <p className="text-muted-foreground text-sm">
                      Bénéficiez du potentiel d'appréciation à long terme du Bitcoin.
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Avantage concurrentiel</h3>
                    <p className="text-muted-foreground text-sm">
                      Positionnez votre entreprise comme innovante et tournée vers l'avenir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="services" className="w-full py-6 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
          </div>
          <div className="container px-4 md:px-6 relative z-20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                Nos Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-2">
                Nos Services
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Des solutions adaptées pour intégrer Bitcoin dans votre stratégie financière
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Stratégie d'investissement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analyse personnalisée et élaboration d'une stratégie d'allocation optimale pour votre trésorerie.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Conformité réglementaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accompagnement complet pour assurer la conformité de vos investissements avec la réglementation en vigueur.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Optimisation fiscale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Conseils experts pour maximiser les avantages fiscaux liés à l'intégration de Bitcoin dans votre trésorerie.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="expertise" className="w-full py-6 md:py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-primary/10 to-transparent opacity-50 z-0" />
            <div className="absolute inset-0 bg-grid-black/[0.02] z-0" />
          </div>
          <div className="container px-4 md:px-6 relative z-20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                Notre Expertise
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-2">
                Une expertise reconnue
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Notre équipe d'experts vous accompagne dans la gestion de votre trésorerie en Bitcoin.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle>Notre Approche</CardTitle>
                  <CardDescription>
                    Une méthodologie éprouvée pour une gestion optimale de votre trésorerie.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Analyse Initiale</h4>
                        <p className="text-sm text-muted-foreground">
                          Évaluation approfondie de vos besoins et de votre situation actuelle.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <PieChart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Stratégie Personnalisée</h4>
                        <p className="text-sm text-muted-foreground">
                          Développement d'une stratégie adaptée à vos objectifs.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Suivi et Optimisation</h4>
                        <p className="text-sm text-muted-foreground">
                          Accompagnement continu et ajustements selon l'évolution du marché.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle>Notre Équipe</CardTitle>
                  <CardDescription>
                    Des experts passionnés par l'innovation financière.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Expertise Technique</h4>
                        <p className="text-sm text-muted-foreground">
                          Une équipe spécialisée dans la blockchain et les cryptomonnaies.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Vision Globale</h4>
                        <p className="text-sm text-muted-foreground">
                          Une compréhension approfondie des marchés financiers.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Sécurité Avancée</h4>
                        <p className="text-sm text-muted-foreground">
                          Protection maximale de vos actifs avec les dernières technologies.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-6 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
          </div>
          <div className="container px-4 md:px-6 relative z-20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                Témoignages
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-2">
                Ce que disent nos clients
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Découvrez les expériences de nos clients qui ont fait confiance à Bitsway pour la gestion de leur trésorerie.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">JD</span>
                    </div>
                    <div>
                      <CardTitle>Jean Dupont</CardTitle>
                      <CardDescription>Directeur Financier, TechCorp</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Bitsway nous a accompagnés dans l'intégration de Bitcoin dans notre trésorerie. Leur expertise et leur approche professionnelle ont rendu le processus simple et transparent. Nous sommes très satisfaits des résultats."
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">ML</span>
                    </div>
                    <div>
                      <CardTitle>Marie Laurent</CardTitle>
                      <CardDescription>CEO, InnovStart</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "La diversification de notre trésorerie avec Bitcoin a été une décision stratégique. Bitsway nous a guidés à chaque étape, avec une expertise remarquable et un service client exceptionnel."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-6 md:py-12 lg:py-16 relative overflow-hidden bg-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-primary/10 to-transparent opacity-50 z-0" />
            <div className="absolute inset-0 bg-grid-black/[0.02] z-0" />
          </div>
          <div className="container px-4 md:px-6 relative z-20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                Prêt à commencer ?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-2">
                Prêt à optimiser votre trésorerie ?
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Découvrez comment nous pouvons vous accompagner dans la gestion de votre trésorerie en Bitcoin.
              </p>
            </div>
            <div className="flex justify-center">
              <Button size="lg">
                Prendre rendez-vous
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Contactez-nous
                  </h2>
                  <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
                    Nous sommes là pour répondre à toutes vos questions sur la gestion de trésorerie en Bitcoin.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-sm text-muted-foreground">gaetanlepape@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Téléphone</h3>
                      <p className="text-sm text-muted-foreground">+33 6 12 34 56 78</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-sm text-muted-foreground">Paris, France</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent rounded-2xl blur-3xl" />
                <div className="relative bg-background/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Votre message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={status === "loading"}>
                      {status === "loading" ? "Envoi en cours..." : "Envoyer"}
                    </Button>
                    {status === "success" && (
                      <p className="text-green-500 text-sm">Message envoyé avec succès !</p>
                    )}
                    {status === "error" && (
                      <p className="text-red-500 text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Bitsway</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary">
                Mentions légales
              </Link>
              <Link href="#" className="hover:text-primary">
                Politique de confidentialité
              </Link>
              <Link href="#" className="hover:text-primary">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

