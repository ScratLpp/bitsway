import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function PolitiqueConfidentialite() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-xl font-bold">Bitsway</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Bitsway, en tant que Cabinet de Conseil en Investissements Financiers (CIF), accorde une importance primordiale à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
            </p>

            <h2>2. Collecte des données</h2>
            <p>
              Nous collectons les données suivantes :
            </p>
            <ul>
              <li>Informations d'identification (nom, prénom, adresse, etc.)</li>
              <li>Coordonnées (email, téléphone)</li>
              <li>Informations financières nécessaires à l'exercice de notre activité</li>
              <li>Données de navigation sur notre site</li>
            </ul>

            <h2>3. Utilisation des données</h2>
            <p>
              Vos données sont utilisées pour :
            </p>
            <ul>
              <li>Répondre à vos demandes d'information</li>
              <li>Vous fournir nos services de conseil en investissement</li>
              <li>Respecter nos obligations légales et réglementaires</li>
              <li>Améliorer notre site et nos services</li>
            </ul>

            <h2>4. Protection des données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>

            <h2>5. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul>
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, certaines fonctionnalités du site pourraient ne pas fonctionner correctement.
            </p>

            <h2>7. Contact</h2>
            <p>
              Pour toute question concernant la protection de vos données personnelles, vous pouvez nous contacter à l'adresse : contact@bitsway.fr
            </p>

            <h2>8. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
            </p>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo className="h-5 w-5" />
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