"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, ChevronRight, Lock, PieChart, Shield, TrendingUp, Globe, Users, Lightbulb, Target, GraduationCap, Headphones, BookOpen, Calculator, Mail, Phone, MapPin, Calendar, CheckCircle2, ChevronDown, Linkedin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import InflationChart from './components/InflationChart'
import GrowthChart from './components/GrowthChart'
import CompaniesChart from './components/CompaniesChart'
import CorrelationChart from './components/CorrelationChart'

// Configuration du formulaire de contact avec Resend
export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [activeBenefit, setActiveBenefit] = useState<string>("Protection contre l'inflation")

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

  const benefits = [
    {
      title: "Protection contre l'inflation",
      description: "Préservez la valeur de votre trésorerie face à la dépréciation monétaire.",
      hasChart: true,
      chart: "inflation"
    },
    {
      title: "Diversification du portefeuille",
      description: "Réduisez les risques en diversifiant vos actifs avec une classe d'actif décorrélée.",
      hasChart: true,
      chart: "correlation"
    },
    {
      title: "Potentiel de croissance",
      description: "Bénéficiez du potentiel d'appréciation à long terme du Bitcoin.",
      hasChart: true,
      chart: "growth"
    },
    {
      title: "Adoption croissante",
      description: "Rejoignez le mouvement des entreprises qui intègrent Bitcoin dans leur trésorerie.",
      hasChart: true,
      chart: "companies"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
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
          <Button asChild>
            <Link href="https://calendly.com/bitsway/nouvelle-reunion?preview_source=et_card" target="_blank">
              Prendre Rendez-vous
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full pt-4 pb-12 md:pt-8 md:pb-16 lg:pt-12 lg:pb-20 bg-gradient-to-b from-muted/50 to-muted relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
          </div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
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
                  <Button asChild size="lg">
                    <Link href="https://calendly.com/bitsway/nouvelle-reunion?preview_source=et_card" target="_blank">
                      Découvrir nos solutions <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    En savoir plus
                  </Button>
                </div>
              </div>
              <div className="relative w-full max-w-[600px] mx-auto">
                <div className="relative">
                  <Image
                    src="/bitcoin-expert.png"
                    alt="Bitcoin Treasury Management"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-2xl"
                    priority
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 400px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="benefits" className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className={`group flex items-start gap-3 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                      activeBenefit === benefit.title ? 'bg-white/10 border-primary/20' : ''
                    }`}
                    onMouseEnter={() => setActiveBenefit(benefit.title)}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      activeBenefit === benefit.title ? 'bg-primary/20' : 'bg-primary/10 group-hover:bg-primary/20'
                    }`}>
                      {activeBenefit === benefit.title ? (
                        <ChevronDown className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold mb-1 transition-colors ${
                        activeBenefit === benefit.title ? 'text-primary' : 'group-hover:text-primary'
                      }`}>
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl -mt-2">
                <h3 className="text-lg font-bold mb-4 text-center pt-4 px-4">
                  {activeBenefit === "Protection contre l'inflation" 
                    ? "Que deviennent 1000€ entre 2020 et 2024 ?"
                    : activeBenefit === "Potentiel de croissance"
                    ? "Évolution de la capitalisation de Bitcoin depuis 2016"
                    : activeBenefit === "Adoption croissante"
                    ? "Évolution du nombre d'entreprises publiques détenant du Bitcoin"
                    : activeBenefit === "Diversification du portefeuille"
                    ? "Corrélation de Bitcoin avec les actifs traditionnels"
                    : "Graphique à venir"}
                </h3>
                <div className="border border-gray-200 rounded-lg pb-4 pt-4 px-4">
                  <div className="w-full h-[400px]">
                    {activeBenefit === "Protection contre l'inflation" && <InflationChart />}
                    {activeBenefit === "Diversification du portefeuille" && <CorrelationChart />}
                    {activeBenefit === "Potentiel de croissance" && <GrowthChart />}
                    {activeBenefit === "Adoption croissante" && <CompaniesChart />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="services" className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Formation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Formation des dirigeants et équipes financières aux fondamentaux de Bitcoin et à son positionnement comme actif stratégique au sein de la trésorerie d'entreprise.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Audit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Évaluation de la trésorerie et du contexte économique de l'entreprise pour structurer une allocation en Bitcoin.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Conseil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Conseil en investissement pour définir une stratégie d'exposition adaptée au contexte économique et aux conditions de marché.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Structuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accompagnement opérationnel et structuration de l'environnement d'investissement.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Pilotage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Encadrement opérationnel de l'exposition à Bitcoin, intégrant une veille de marché continue et des signaux d'ajustement alignés sur l'évolution du contexte économique.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Intégration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accompagnement auprès des services comptables et juridiques de l'entreprise pour faciliter l'intégration de Bitcoin dans les processus internes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="expertise" className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden">
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
        <section className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
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
        <section className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden bg-white">
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
              <Button asChild size="lg">
                <Link href="https://calendly.com/bitsway/nouvelle-reunion?preview_source=et_card" target="_blank">
                  Prendre rendez-vous <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-16 lg:py-20 bg-primary text-primary-foreground">
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
                  <Link href="mailto:contact@bitsway.fr" className="flex items-center gap-4 group">
                    <div className="p-2 rounded-lg bg-white transition-all duration-300 group-hover:shadow-inner group-hover:shadow-primary/20">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-sm text-white/80">contact@bitsway.fr</p>
                    </div>
                  </Link>
                  <Link 
                    href="https://calendly.com/bitsway/nouvelle-reunion?preview_source=et_card"
                    target="_blank"
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-2 rounded-lg bg-white transition-all duration-300 group-hover:shadow-inner group-hover:shadow-primary/20">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Prendre rendez-vous</h3>
                      <p className="text-sm text-white/80">Planifier une consultation</p>
                    </div>
                  </Link>
                  <a 
                    href="https://www.linkedin.com/company/bitsway/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-2 rounded-lg bg-white transition-all duration-300 group-hover:shadow-inner group-hover:shadow-primary/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#2867B2"
                        className="h-6 w-6 object-contain"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">LinkedIn</h3>
                      <p className="text-sm text-white/80">Suivez notre actualité</p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent rounded-2xl blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Nom</Label>
                      <Input
                        id="name"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white border-white/20 text-black placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-white border-white/20 text-black placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Votre message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="bg-white border-white/20 text-black placeholder:text-gray-500"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={status === "loading"}>
                      {status === "loading" ? "Envoi en cours..." : "Envoyer"}
                    </Button>
                    {status === "success" && (
                      <p className="text-white text-sm">Message envoyé avec succès !</p>
                    )}
                    {status === "error" && (
                      <p className="text-white text-sm">Une erreur est survenue. Veuillez réessayer.</p>
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
              <Logo className="h-6 w-6" />
              <span className="text-sm font-medium">Bitsway</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/legal/mentions-legales" className="hover:text-primary">
                Mentions légales
              </Link>
              <Link href="/legal/politique-confidentialite" className="hover:text-primary">
                Politique de confidentialité
              </Link>
              <Link href="/legal/cgu" className="hover:text-primary">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

