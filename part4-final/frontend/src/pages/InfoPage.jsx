import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const PAGES = {
    // ── Voyageurs ──
    'comment-ca-marche': {
        title: 'Comment ça marche',
        subtitle: 'Réservez votre séjour spatial en quelques étapes',
        sections: [
            {
                heading: 'Explorez les destinations',
                text: "Parcourez notre catalogue de séjours à travers le système solaire. De Mars à Europa, en passant par la Lune et Titan, chaque destination offre une expérience unique. Utilisez les filtres pour trouver l'habitat qui correspond à vos envies.",
            },
            {
                heading: 'Réservez en un clic',
                text: "Une fois votre séjour trouvé, cliquez sur « Réserver ». Sélectionnez vos dates, vérifiez les détails et confirmez. Votre hôte sera immédiatement notifié et vous recontactera pour finaliser les modalités du voyage.",
            },
            {
                heading: 'Préparez votre voyage',
                text: "Après confirmation, vous recevrez un guide de préparation complet : check-list d'équipement, briefing médical, protocoles de sécurité et itinéraire détaillé. Notre équipe vous accompagne jusqu'au décollage.",
            },
            {
                heading: 'Vivez l\'expérience',
                text: "À votre arrivée, votre hôte vous accueille et vous guide dans votre nouvel environnement. Profitez de chaque instant et n'oubliez pas de laisser un avis pour aider les futurs voyageurs !",
            },
        ],
    },
    'sejours-populaires': {
        title: 'Séjours populaires',
        subtitle: 'Les destinations les plus prisées par nos voyageurs',
        sections: [
            {
                heading: 'Dôme Olympus — Mars',
                text: "Notre destination phare. Le dôme pressurisé au pied d'Olympus Mons offre une vue imprenable sur les plaines martiennes. Élu « Meilleur séjour spatial » trois années consécutives par les voyageurs HolByNB.",
            },
            {
                heading: 'Station Orbitale Sérénité',
                text: "L'expérience ultime de l'apesanteur. Flottez à 400 km au-dessus de la Terre en admirant 16 levers de soleil par jour. Le spa zéro-G et la cuisine moléculaire du chef en font un incontournable.",
            },
            {
                heading: 'Habitat Europa',
                text: "Pour les aventuriers en quête d'extraordinaire. Plongez sous la croûte glacée d'Europa et découvrez l'océan extraterrestre. Une expérience que seul HolByNB peut offrir.",
            },
        ],
    },
    faq: {
        title: 'FAQ',
        subtitle: 'Questions fréquemment posées',
        sections: [
            {
                heading: 'Faut-il une formation spéciale ?',
                text: "Non ! Tous nos séjours sont accessibles sans formation préalable. Un briefing de sécurité de 2 heures est inclus avant chaque départ. Nos habitats sont conçus pour offrir un confort terrestre dans l'espace.",
            },
            {
                heading: 'Comment se passe le voyage ?',
                text: "Le transport est assuré par nos partenaires certifiés. La durée varie selon la destination : quelques heures pour la Lune, plusieurs jours pour Mars. Tous les transports incluent repas, divertissement et accompagnement médical.",
            },
            {
                heading: 'Puis-je annuler ma réservation ?',
                text: "Oui, l'annulation est gratuite jusqu'à 30 jours avant le départ. Entre 30 et 7 jours, des frais de 25% s'appliquent. Moins de 7 jours, la réservation est non remboursable sauf cas de force majeure cosmique.",
            },
            {
                heading: 'Y a-t-il du Wi-Fi ?',
                text: "Absolument ! Tous nos habitats sont équipés du Wi-Fi quantique, offrant une connexion stable même à des millions de kilomètres de la Terre. Débit garanti pour le streaming et les appels vidéo.",
            },
        ],
    },
    'support-voyageurs': {
        title: 'Support voyageurs',
        subtitle: "Notre équipe est là pour vous, 24h/24, 7j/7, dans tout le système solaire",
        sections: [
            {
                heading: 'Avant votre voyage',
                text: "Des questions sur votre réservation, votre destination ou la préparation ? Contactez-nous à support@holbynb.space ou via le chat intégré. Temps de réponse moyen : moins de 15 minutes.",
            },
            {
                heading: 'Pendant votre séjour',
                text: "Une ligne d'urgence dédiée est disponible 24h/24 sur tous nos habitats. En cas de problème technique, nos équipes interviennent dans l'heure. Votre sécurité est notre priorité absolue.",
            },
            {
                heading: 'Après votre retour',
                text: "N'hésitez pas à partager votre expérience via un avis sur la plateforme. Pour toute réclamation ou suggestion, notre équipe qualité traite chaque demande sous 48 heures.",
            },
        ],
    },

    // ── Hôtes ──
    'devenir-hote': {
        title: 'Devenir hôte',
        subtitle: "Partagez votre habitat spatial avec des voyageurs du monde entier",
        sections: [
            {
                heading: 'Pourquoi devenir hôte ?',
                text: "Rejoignez une communauté d'hôtes passionnés et rentabilisez votre habitat spatial. HolByNB vous offre une visibilité unique auprès de milliers de voyageurs en quête d'aventure interstellaire.",
            },
            {
                heading: 'Comment ça marche ?',
                text: "Créez votre annonce en quelques minutes : ajoutez des photos, une description et fixez votre prix. Notre équipe vérifie chaque habitat pour garantir la sécurité et la qualité. Une fois validé, vous commencez à recevoir des réservations.",
            },
            {
                heading: 'Ce que nous offrons',
                text: "Assurance hôte complète, support dédié, outils de gestion avancés et paiements sécurisés. Nous prenons une commission de 3% seulement — l'une des plus basses du marché spatial.",
            },
        ],
    },
    ressources: {
        title: 'Ressources',
        subtitle: "Guides et outils pour les hôtes HolByNB",
        sections: [
            {
                heading: 'Guide du parfait hôte',
                text: "Optimisez votre annonce : photos professionnelles, description engageante, prix compétitif. Nos hôtes les mieux notés suivent ces bonnes pratiques et voient leurs réservations augmenter de 40%.",
            },
            {
                heading: 'Normes de sécurité',
                text: "Tous les habitats doivent respecter les normes de sécurité intersidérale ISO-SPACE 2026. Consultez notre checklist complète pour vous assurer que votre habitat est conforme.",
            },
            {
                heading: 'Support hôte',
                text: "Une question ? Notre équipe dédiée aux hôtes est disponible 7j/7. Contactez-nous à hosts@holbynb.space ou via le tableau de bord hôte.",
            },
        ],
    },
    'tableau-de-bord': {
        title: 'Tableau de bord',
        subtitle: "Gérez vos annonces et réservations",
        sections: [
            {
                heading: 'Vue d\'ensemble',
                text: "Le tableau de bord hôte centralise toutes vos données : réservations en cours, avis récents, revenus mensuels et taux d'occupation. Tout ce dont vous avez besoin en un coup d'œil.",
            },
            {
                heading: 'Gestion des réservations',
                text: "Acceptez ou refusez les demandes, communiquez avec vos voyageurs et gérez votre calendrier de disponibilité. Les notifications en temps réel vous tiennent informé à chaque étape.",
            },
            {
                heading: 'Analytiques',
                text: "Suivez les performances de vos annonces : nombre de vues, taux de conversion, comparaison avec des habitats similaires. Utilisez ces données pour optimiser votre offre.",
            },
        ],
    },
    communaute: {
        title: 'Communauté',
        subtitle: "Rejoignez le réseau des passionnés du voyage spatial",
        sections: [
            {
                heading: 'Forum des hôtes',
                text: "Échangez avec d'autres hôtes, partagez vos astuces et posez vos questions. La communauté HolByNB compte plus de 500 hôtes actifs à travers le système solaire.",
            },
            {
                heading: 'Événements',
                text: "Participez à nos événements réguliers : rencontres entre hôtes, webinaires thématiques, conférences sur le tourisme spatial. Le prochain événement : « Hospitality Beyond Earth » — Station Orbitale, juin 2026.",
            },
            {
                heading: 'Blog',
                text: "Découvrez les témoignages de nos hôtes et voyageurs, les coulisses de HolByNB et les dernières actualités du tourisme spatial sur notre blog.",
            },
        ],
    },

    // ── HolByNB ──
    'a-propos': {
        title: 'À propos',
        subtitle: "L'hébergement spatial, réinventé",
        sections: [
            {
                heading: 'Notre mission',
                text: "HolByNB est née d'une vision simple : rendre le voyage spatial accessible à tous. Nous connectons des voyageurs curieux avec des hôtes passionnés qui ouvrent les portes de leurs habitats à travers le système solaire.",
            },
            {
                heading: 'Notre histoire',
                text: "Fondée en 2024 par une équipe d'ingénieurs et de passionnés d'exploration spatiale, HolByNB est passée de 3 habitats à plus de 50 en moins de deux ans. Aujourd'hui, nous sommes la première plateforme de réservation spatiale au monde.",
            },
            {
                heading: 'Nos valeurs',
                text: "Sécurité, accessibilité, durabilité. Chaque habitat listé sur HolByNB respecte des normes strictes. Nous investissons dans la recherche pour rendre le tourisme spatial plus durable et inclusif.",
            },
        ],
    },
    carrieres: {
        title: 'Carrières',
        subtitle: "Construisez l'avenir du voyage spatial avec nous",
        sections: [
            {
                heading: 'Pourquoi nous rejoindre ?',
                text: "Chez HolByNB, chaque journée est une aventure. Nous sommes une équipe de 45 personnes réparties entre la Terre et nos bureaux orbitaux. Télétravail, horaires flexibles et missions passionnantes.",
            },
            {
                heading: 'Postes ouverts',
                text: "Nous recrutons : ingénieurs full-stack, designers UX, spécialistes sécurité spatiale, community managers et responsables partenariats. Envoyez votre candidature à careers@holbynb.space.",
            },
            {
                heading: 'Culture d\'entreprise',
                text: "Innovation, bienveillance et audace. Nous croyons que les meilleures idées naissent dans un environnement où chacun peut s'exprimer librement. Séminaire annuel en orbite inclus.",
            },
        ],
    },
    presse: {
        title: 'Presse',
        subtitle: "Espace presse et médias",
        sections: [
            {
                heading: 'Kit presse',
                text: "Téléchargez notre kit presse incluant logos, visuels haute résolution, fiches produit et biographies de l'équipe fondatrice. Disponible en français et en anglais.",
            },
            {
                heading: 'Ils parlent de nous',
                text: "\"HolByNB révolutionne le concept même de vacances\" — Le Monde · \"La startup qui démocratise l'espace\" — TechCrunch · \"L'Airbnb de l'espace, mais en mieux\" — Wired",
            },
            {
                heading: 'Contact presse',
                text: "Pour toute demande d'interview, reportage ou partenariat média, contactez notre équipe communication à press@holbynb.space. Temps de réponse : 24 heures.",
            },
        ],
    },
    contact: {
        title: 'Contact',
        subtitle: "Nous sommes à votre écoute",
        sections: [
            {
                heading: 'Support général',
                text: "Email : contact@holbynb.space\nTéléphone : +33 1 23 45 67 89\nHoraires : 24h/24, 7j/7 (temps terrestre universel)",
            },
            {
                heading: 'Siège social',
                text: "HolByNB SAS\n42 Rue de l'Innovation\n31000 Toulouse, France\n\nBureau orbital : Station Sérénité, Module B-7",
            },
            {
                heading: 'Réseaux sociaux',
                text: "Suivez-nous pour les dernières actualités, offres exclusives et contenus immersifs. @HolByNB sur toutes les plateformes.",
            },
        ],
    },
};

export default function InfoPage() {
    const { page } = useParams();
    const data = PAGES[page];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    if (!data) {
        return (
            <div style={{ background: '#040710', minHeight: '100vh', color: '#fff' }}>
                <Navbar />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '60vh',
                        color: 'rgba(255,255,255,0.4)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    Page introuvable.
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ background: '#040710', minHeight: '100vh', color: '#fff' }}>
            <Navbar />

            <div
                style={{
                    maxWidth: '48rem',
                    margin: '0 auto',
                    width: '100%',
                }}
                className="info-container"
            >
                <motion.div {...fadeUp(0)}>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            color: 'rgba(255,255,255,0.5)',
                            fontFamily: 'var(--font-body)',
                            textDecoration: 'none',
                            marginBottom: '2rem',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')
                        }
                    >
                        <ArrowLeft size={16} />
                        Retour
                    </Link>
                </motion.div>

                <motion.div {...fadeUp(0.05)} style={{ marginBottom: '3rem' }}>
                    <h1
                        style={{
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '-2px',
                            color: '#fff',
                            margin: 0,
                            fontSize: '2.5rem',
                        }}
                    >
                        {data.title}
                    </h1>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.4)',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 300,
                            marginTop: '0.5rem',
                            fontSize: '0.875rem',
                        }}
                    >
                        {data.subtitle}
                    </p>
                </motion.div>

                {data.sections.map((section, i) => (
                    <motion.div
                        key={i}
                        {...fadeUp(0.1 + i * 0.05)}
                        style={{
                            marginBottom: '2.5rem',
                            borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                            paddingTop: i > 0 ? '2.5rem' : 0,
                        }}
                    >
                        <h2
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontWeight: 600,
                                color: '#fff',
                                fontSize: '1.125rem',
                                marginBottom: '0.75rem',
                            }}
                        >
                            {section.heading}
                        </h2>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.5)',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 300,
                                lineHeight: 1.7,
                                fontSize: '0.875rem',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {section.text}
                        </p>
                    </motion.div>
                ))}
            </div>

            <Footer />

            <style>{`
        .info-container {
          padding: 0 1rem 4rem;
        }
        @media (min-width: 768px) {
          .info-container { padding: 0 2rem 4rem; }
        }
      `}</style>
        </div>
    );
}
