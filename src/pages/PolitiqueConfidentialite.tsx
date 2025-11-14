import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Shield className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Politique de Confidentialité
            </h1>
          </div>

          <Card className="bg-gradient-card shadow-card border border-border/50 p-6 md:p-8 space-y-6">
            <section className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
              <p className="text-foreground font-medium">
                Dernière mise à jour: 14 janvier 2025.
              </p>
              <p>
                Chez LeCOQ.Café, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette Politique de confidentialité explique quelles informations nous recueillons, comment nous les utilisons, et quels sont vos droits concernant ces informations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Informations que nous recueillons</h2>
              <p className="text-muted-foreground">
                Nous pouvons recueillir les types d'informations suivants lorsque vous utilisez l'application LimboLimbo :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Données techniques :</strong> Version du système d'exploitation, type d'appareil, préférences d'affichage, adresse IP (anonymisée)</li>
                <li><strong>Données d'utilisation :</strong> Pages visitées, temps passé sur l'application, fonctionnalités utilisées</li>
                <li><strong>Données volontaires :</strong> Si vous choisissez de nous contacter, les informations que vous nous fournissez</li>
                <li><strong>Cookies et technologies similaires :</strong> Pour améliorer votre expérience et analyser l'utilisation</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. Comment nous utilisons vos informations</h2>
              <p className="text-muted-foreground">
                Nous utilisons vos informations pour :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Fournir et maintenir l'application LimboLimbo</li>
                <li>Améliorer les fonctionnalités et l'expérience utilisateur</li>
                <li>Analyser les tendances d'utilisation pour optimiser nos services</li>
                <li>Détecter et prévenir les abus techniques</li>
                <li>Communiquer avec vous si nécessaire (support technique, notifications importantes)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. Partage de vos informations</h2>
              <p className="text-muted-foreground">
                Nous ne vendons pas vos données personnelles. Nous ne partageons vos informations que dans les cas suivants :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Fournisseurs de services :</strong> Des tiers techniques qui nous aident à faire fonctionner l'application</li>
                <li><strong>Obligations légales :</strong> Si la loi nous y oblige ou pour protéger nos droits</li>
                <li><strong>Transfert d'entreprise :</strong> En cas de fusion, acquisition ou vente d'actifs</li>
              </ul>
              <p className="text-muted-foreground">
                Tous nos partenaires sont tenus de maintenir la confidentialité et la sécurité de vos informations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Sécurité de vos données</h2>
              <p className="text-muted-foreground">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction. Cependant, aucune méthode de transmission sur Internet n'est totalement sécurisée.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Conservation des données</h2>
              <p className="text-muted-foreground">
                Nous conservons vos informations personnelles aussi longtemps que nécessaire pour remplir les fins décrites dans cette politique, sauf si la loi exige une période de conservation plus longue. Les données anonymisées peuvent être conservées indéfiniment à des fins d'analyse statistique.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Vos droits</h2>
              <p className="text-muted-foreground">
                Conformément aux lois applicables, vous avez le droit de :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier des informations inexactes</li>
                <li>Demander la suppression de vos données</li>
                <li>Vous opposer à certains traitements</li>
                <li>Demander la portabilité de vos données</li>
              </ul>
              <p className="text-muted-foreground">
                Pour exercer ces droits, contactez-nous à l'adresse indiquée à la section 9.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">7. Cookies et suivi</h2>
              <p className="text-muted-foreground">
                Nous utilisons des cookies et technologies similaires pour améliorer votre expérience. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités de l'application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Modifications de cette politique</h2>
              <p className="text-muted-foreground">
                Nous pouvons mettre à jour cette politique de confidentialité pour refléter les changements dans nos pratiques ou pour des raisons opérationnelles, légales ou réglementaires. La date de la dernière mise à jour sera toujours indiquée en haut de ce document.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Par le formulaire de contact sur https://lecoq.cafe/contact</li>
                <li>Par courriel à l'adresse disponible sur notre site web</li>
              </ul>
              <p className="text-muted-foreground">
                LeCOQ.Café - Siège social : Lévis (Québec, Canada)
              </p>
            </section>

            <section className="pt-2 space-y-2 text-sm md:text-base">
              <p className="text-foreground">© 2024–2025 LeCOQ.Café - Tous droits réservés</p>
              <p>
                <Link to="/conditions" className="text-primary hover:underline">
                  Voir nos Conditions d'utilisation
                </Link>
              </p>
              <p>
                <Link to="/a-propos" className="text-primary hover:underline">
                  Retour à la page À propos
                </Link>
              </p>
            </section>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;