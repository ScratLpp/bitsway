import Link from "next/link"
import { Bitcoin } from "lucide-react"

export default function MentionsLegales() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Bitcoin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Bitsway</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2>1. Informations légales</h2>
            <p>
              Le présent site est édité par Bitsway, Cabinet de Conseil en Investissements Financiers (CIF) enregistré à l'ORIAS sous le numéro [NUMÉRO ORIAS].
            </p>
            <p>
              Siège social : [ADRESSE COMPLÈTE]<br />
              SIRET : [NUMÉRO SIRET]<br />
              TVA : [NUMÉRO TVA]
            </p>

            <h2>2. Statut juridique</h2>
            <p>
              Bitsway est un Cabinet de Conseil en Investissements Financiers (CIF) agréé par l'Autorité des Marchés Financiers (AMF) et enregistré à l'ORIAS.
            </p>

            <h2>3. Activité réglementée</h2>
            <p>
              Notre activité de conseil en investissements financiers est exercée conformément aux dispositions du Code monétaire et financier et des règlements de l'AMF.
            </p>

            <h2>4. Protection des investisseurs</h2>
            <p>
              En tant que CIF, nous sommes tenus de respecter les règles de bonne conduite et les obligations d'information vis-à-vis de nos clients, conformément à la réglementation en vigueur.
            </p>

            <h2>5. Hébergement du site</h2>
            <p>
              Ce site est hébergé par Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>

            <h2>6. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la propriété exclusive de Bitsway ou de ses partenaires. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable.
            </p>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-primary" />
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