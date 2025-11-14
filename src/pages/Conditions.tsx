import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Conditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Conditions d'utilisation
            </h1>
          </div>

          <Card className="bg-gradient-card shadow-card border border-border/50 p-6 md:p-8 space-y-6">
            <section className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
              <p className="text-foreground font-medium">
                Dernière mise à jour: 7 novembre 2025.
              </p>
              <p>
                Bienvenue sur LimboLimbo, une application développée et exploitée par LeCOQ.Café, dont le siège social est situé à Lévis (Québec, Canada). En utilisant l'application LimboLimbo (ci-après « l'Application »), vous acceptez d'être lié(e) par les présentes Conditions d'utilisation. Si vous n'acceptez pas ces conditions, vous devez cesser immédiatement d'utiliser l'Application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Objet de l'Application</h2>
              <p className="text-muted-foreground">
                L'Application LimboLimbo a pour objectif de suggérer, recommander ou présenter des liens externes, contenus web, ou services tiers susceptibles d'intéresser ses utilisateurs. Ces suggestions sont offertes à titre informatif uniquement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. Absence de responsabilité concernant les sites externes</h2>
              <p className="text-muted-foreground">
                L'Application peut afficher ou suggérer des liens vers des sites web, services, plateformes ou contenus exploités par des tiers indépendants. LeCOQ.Café et LimboLimbo :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>n'exercent aucun contrôle sur le contenu, les pratiques ou les politiques de ces sites;</li>
                <li>ne garantissent pas l'exactitude, la fiabilité ou la sécurité des informations qui y sont présentées;</li>
                <li>ne peuvent être tenus responsables de tout dommage, perte ou préjudice résultant de votre utilisation de ces sites ou services externes.</li>
              </ul>
              <p className="text-muted-foreground">
                Vous êtes entièrement responsable de votre navigation et de la vérification de la fiabilité des sources externes suggérées.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. Utilisation permise de l'Application</h2>
              <p className="text-muted-foreground">
                Vous vous engagez à utiliser l'Application :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>conformément aux lois en vigueur au Québec et au Canada;</li>
                <li>uniquement à des fins personnelles et non commerciales;</li>
                <li>sans tenter de nuire, de surcharger ou de perturber son fonctionnement.</li>
              </ul>
              <p className="text-muted-foreground">
                LeCOQ.Café se réserve le droit de suspendre ou de restreindre l'accès à toute personne qui ne respecte pas ces conditions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Propriété intellectuelle</h2>
              <p className="text-muted-foreground">
                Tout le contenu de l'Application — y compris les textes, interfaces, graphismes, logos, éléments visuels, et codes informatiques — est la propriété exclusive de LeCOQ.Café ou de ses partenaires et est protégé par les lois canadiennes et internationales sur le droit d'auteur et la propriété intellectuelle. Toute reproduction, modification, diffusion ou utilisation non autorisée est strictement interdite sans consentement écrit préalable de LeCOQ.Café.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Collecte et protection des données</h2>
              <p className="text-muted-foreground">
                L'Application LimboLimbo peut recueillir certaines données techniques (par exemple : version du système d'exploitation, préférences d'affichage, etc.) afin d'améliorer l'expérience utilisateur. Aucune donnée personnelle identifiable n'est recueillie sans votre consentement explicite. Pour plus d'informations, veuillez consulter notre 
                <Link to="/politique-confidentialite" className="text-primary hover:underline ml-1">
                  Politique de confidentialité
                </Link>
                , disponible dans l'Application ou sur demande sur https://lecoq.cafe .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Limitation de responsabilité</h2>
              <p className="text-muted-foreground">
                Dans la mesure permise par la loi :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>LeCOQ.Café et ses collaborateurs ne pourront être tenus responsables d'aucun dommage direct, indirect, accessoire ou consécutif découlant de l'utilisation ou de l'impossibilité d'utiliser l'Application;</li>
                <li>L'Application est fournie « telle quelle », sans garantie d'aucune sorte, expresse ou implicite, notamment quant à sa fiabilité, sa disponibilité ou son exactitude.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">7. Modification des conditions</h2>
              <p className="text-muted-foreground">
                LeCOQ.Café se réserve le droit de modifier les présentes Conditions d'utilisation à tout moment, sans préavis. La date de la dernière mise à jour figurera toujours en haut de ce document. En continuant d'utiliser l'Application après une mise à jour, vous acceptez les nouvelles conditions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Droit applicable et juridiction</h2>
              <p className="text-muted-foreground">
                Ces Conditions d'utilisation sont régies par les lois du Québec et du Canada. Tout litige sera soumis à la compétence exclusive des tribunaux situés dans le district judiciaire de Québec.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question, commentaire ou demande concernant ces Conditions d'utilisation, vous pouvez contacter :
                LeCOQ.Café sur https://lecoq.cafe/contact .
              </p>
            </section>

            <section className="pt-2 space-y-2 text-sm md:text-base">
              <p className="text-foreground">© 2024–2025 LeCOQ.Café - Tous droits réservés</p>
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

export default Conditions;