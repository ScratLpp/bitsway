import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function CGU() {
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
          <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2>1. Objet</h2>
            <p>
              Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation du site internet de Bitsway, Cabinet de Conseil en Investissements Financiers (CIF). En accédant à ce site, vous acceptez d'être lié par ces CGU.
            </p>

            <h2>2. Services proposés</h2>
            <p>
              Bitsway propose des services de conseil en investissements financiers, notamment dans le domaine des cryptomonnaies et plus spécifiquement du Bitcoin. Nos services sont exercés conformément à la réglementation en vigueur et aux règles de l'AMF.
            </p>

            <h2>3. Accès aux services</h2>
            <p>
              L'accès à nos services est conditionné à :
            </p>
            <ul>
              <li>L'acceptation des présentes CGU</li>
              <li>La fourniture d'informations exactes et à jour</li>
              <li>Le respect des obligations légales et réglementaires</li>
            </ul>

            <h2>4. Obligations de l'utilisateur</h2>
            <p>
              L'utilisateur s'engage à :
            </p>
            <ul>
              <li>Ne pas utiliser le site à des fins illégales</li>
              <li>Ne pas tenter de perturber le fonctionnement du site</li>
              <li>Ne pas diffuser de contenu illicite ou préjudiciable</li>
              <li>Respecter la propriété intellectuelle</li>
            </ul>

            <h2>5. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu du site (textes, images, vidéos, logos, etc.) est la propriété exclusive de Bitsway ou de ses partenaires. Toute reproduction ou utilisation non autorisée est interdite.
            </p>

            <h2>6. Limitation de responsabilité</h2>
            <p>
              Les informations fournies sur ce site sont données à titre indicatif et ne constituent pas des conseils en investissement. Bitsway ne peut être tenu responsable des décisions d'investissement prises par les utilisateurs sur la base des informations fournies.
            </p>

            <h2>7. Protection des données personnelles</h2>
            <p>
              Le traitement des données personnelles est régi par notre politique de confidentialité, accessible sur le site.
            </p>

            <h2>8. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>

            <h2>9. Modification des CGU</h2>
            <p>
              Bitsway se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
            </p>

            <h2>10. Contact</h2>
            <p>
              Pour toute question concernant les présentes CGU, vous pouvez nous contacter à l'adresse : contact@bitsway.fr
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