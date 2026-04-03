"""Seed the database with space-themed test data."""
from app import create_app, db
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity

app = create_app()

with app.app_context():
    db.create_all()

    # --- Users ---
    host1 = User(
        first_name="Elon",
        last_name="Starfield",
        email="elon@spacestays.io",
        password="password123",
    )
    host2 = User(
        first_name="Aria",
        last_name="Nebula",
        email="aria@spacestays.io",
        password="password123",
    )
    guest = User(
        first_name="Victor",
        last_name="Voyager",
        email="victor@spacestays.io",
        password="password123",
    )
    admin = User(
        first_name="Admin",
        last_name="HolByNB",
        email="admin@spacestays.io",
        password="admin123",
        is_admin=True,
    )
    db.session.add_all([host1, host2, guest, admin])
    db.session.flush()

    # --- Amenities ---
    amenities = []
    for name in ["Gravité artificielle", "Vue panoramique", "Oxygène premium",
                 "Wi-Fi quantique", "Spa zéro-G", "Cuisine moléculaire"]:
        a = Amenity(name=name)
        amenities.append(a)
    db.session.add_all(amenities)
    db.session.flush()

    # --- Places ---
    places_data = [
        {
            "title": "Dôme Olympus — Panorama sur Mars",
            "description": "Niché au pied du légendaire Olympus Mons, ce dôme pressurisé de dernière génération offre une vue imprenable sur les plaines rouges martiennes. Réveillez-vous face au lever du soleil sur le plus grand volcan du système solaire. L'habitat dispose d'une gravité artificielle calibrée à 0.38g, d'un jardin hydroponique privé et d'un observatoire panoramique à 360°. Idéal pour les explorateurs en quête de silence absolu et de paysages à couper le souffle.",
            "price": 1250.0,
            "latitude": 18.65,
            "longitude": -133.8,
            "owner_id": host1.id,
            "image_url": "/images/mars.jpg",
        },
        {
            "title": "Station Orbitale Sérénité",
            "description": "Flottez à 400 km au-dessus de la Terre dans cette station orbitale entièrement rénovée. Chaque module est équipé de hublots panoramiques offrant une vue continue sur notre planète bleue. Profitez de la micropesanteur dans le spa zéro-G, dégustez une cuisine moléculaire préparée par notre chef étoilé, et laissez-vous bercer par 16 levers de soleil quotidiens. La connexion Wi-Fi quantique vous permet de rester connecté à 28 000 km/h.",
            "price": 890.0,
            "latitude": 51.6,
            "longitude": -0.14,
            "owner_id": host1.id,
            "image_url": "/images/orbital.jpg",
        },
        {
            "title": "Capsule Lunaire Tranquility",
            "description": "Posée dans la mythique Mer de la Tranquillité, cette capsule de luxe vous plonge dans le silence absolu de la Lune. Marchez sur les traces des premiers astronautes à quelques mètres du site historique d'Apollo 11. L'habitat souterrain offre une protection naturelle contre les radiations et maintient une température constante. Contemplez la Terre depuis votre lit à travers le dôme en verre renforcé. Une expérience hors du temps.",
            "price": 675.0,
            "latitude": 0.67,
            "longitude": 23.47,
            "owner_id": host2.id,
            "image_url": "/images/moon.jpg",
        },
        {
            "title": "Habitat Europa — Sous la Glace",
            "description": "Plongez sous la croûte glacée d'Europa pour une expérience unique dans le système solaire. Cet habitat sous-marin vous offre une vue directe sur l'océan extraterrestre, éclairé par des luminaires bioluminescents. Observez les formations géologiques spectaculaires des cheminées hydrothermales depuis le confort de votre suite pressurisée. Jupiter domine le ciel visible à travers les puits de lumière percés dans la glace. Le séjour le plus exclusif de la galaxie.",
            "price": 2100.0,
            "latitude": -0.05,
            "longitude": -1.5,
            "owner_id": host2.id,
            "image_url": "/images/europa.jpg",
        },
        {
            "title": "Nébuleuse Lounge Titan",
            "description": "Sur les rives des lacs de méthane de Titan, ce lounge futuriste offre un spectacle visuel sans pareil. Admirez les reflets dorés de Saturne et ses anneaux qui illuminent l'horizon à travers l'atmosphère dense et orangée. L'habitat est équipé de combinaisons chauffantes pour les excursions extérieures et d'un système de filtration atmosphérique de pointe. Détendez-vous dans le jacuzzi à azote liquide tout en contemplant le coucher de Saturne.",
            "price": 1800.0,
            "latitude": -10.0,
            "longitude": 15.0,
            "owner_id": host1.id,
            "image_url": "/images/titan.jpg",
        },
        {
            "title": "Avant-Poste Vénus Cloud9",
            "description": "Suspendu dans la haute atmosphère de Vénus à 55 km d'altitude, cet avant-poste flottant défie les lois de la gravité. La cité aérienne offre des températures clémentes et une pression quasi terrestre, avec une vue plongeante sur les nuages d'acide sulfurique qui s'étendent à perte de vue. Profitez du restaurant gastronomique avec terrasse extérieure pressurisée, du centre de recherche ouvert aux visiteurs et des couchers de soleil qui durent 58 jours terrestres.",
            "price": 950.0,
            "latitude": -5.0,
            "longitude": 120.0,
            "owner_id": host2.id,
            "image_url": "/images/venus.jpg",
        },
    ]

    places = []
    for i, pdata in enumerate(places_data):
        p = Place(**pdata)
        # Add some amenities to each place
        p.amenities.extend(amenities[: 3 + (i % 3)])
        places.append(p)
    db.session.add_all(places)
    db.session.flush()

    # --- Reviews ---
    reviews_data = [
        # Mars — Dôme Olympus
        (places[0], guest, 5, "Vue incroyable sur Olympus Mons au lever du soleil. Le dôme panoramique est à couper le souffle, on se sent minuscule face à l'immensité martienne. Inoubliable."),
        (places[0], host2, 4, "Habitat très confortable, la gravité martienne à 0.38g est surprenante au début mais on s'y habitue vite. Le jardin hydroponique est un vrai plus pour la fraîcheur des repas."),
        (places[0], admin, 5, "Troisième séjour ici et toujours aussi émerveillé. L'observatoire à 360° de nuit est une expérience quasi mystique. Le personnel est aux petits soins."),
        # Station Orbitale
        (places[1], guest, 5, "Flotter en regardant la Terre défiler en dessous de soi... il n'y a pas de mots. Les 16 levers de soleil par jour ne lassent jamais. Le spa zéro-G est une révolution."),
        (places[1], host2, 5, "Service impeccable et vue à couper le souffle. La cuisine moléculaire du chef est exceptionnelle. On oublie complètement qu'on orbite à 28 000 km/h."),
        (places[1], admin, 4, "Expérience unique mais le module peut sembler un peu compact au bout de quelques jours. La vue compense absolument tout. Wi-Fi quantique impressionnant."),
        # Capsule Lunaire
        (places[2], guest, 4, "Le silence lunaire est magique, on entend littéralement ses propres battements de cœur. Marcher près du site d'Apollo 11 donne des frissons. Petit bémol sur le Wi-Fi par moments."),
        (places[2], host1, 5, "La vue de la Terre depuis le dôme en verre est l'image la plus belle que j'ai vue de ma vie. L'habitat souterrain est étonnamment spacieux et chaleureux."),
        (places[2], admin, 4, "Séjour très reposant, parfait pour déconnecter totalement. La faible gravité lunaire rend chaque déplacement ludique. Je recommande les excursions au cratère voisin."),
        # Europa
        (places[3], guest, 5, "Nager sous la glace d'Europa avec Jupiter visible à travers les puits de lumière... c'est du 10/10 absolu. Les cheminées hydrothermales sont un spectacle naturel inédit."),
        (places[3], host1, 5, "L'expérience la plus extraordinaire de ma vie. L'océan d'Europa est d'une beauté surnaturelle. L'éclairage bioluminescent crée une ambiance irréelle."),
        (places[3], admin, 5, "Le trajet est long mais ça vaut chaque seconde. Se réveiller sous la glace avec vue sur l'océan extraterrestre est quelque chose qu'on n'oublie jamais. Habitat impeccable."),
        (places[3], host2, 4, "Concept révolutionnaire et exécution quasi parfaite. Seul petit regret : les excursions sous-marines sont limitées en durée. J'aurais voulu explorer davantage."),
        # Titan
        (places[4], guest, 4, "Les lacs de méthane au coucher de Saturne, c'est surréaliste. L'atmosphère orangée de Titan donne un côté science-fiction permanent. Le jacuzzi à azote liquide est une expérience à part."),
        (places[4], host2, 5, "Titan est devenu ma destination préférée. Les reflets de Saturne sur les lacs de méthane au crépuscule sont d'une beauté à pleurer. Les combinaisons chauffantes sont très confortables."),
        (places[4], admin, 4, "Ambiance unique dans tout le système solaire. Le lounge est magnifiquement décoré. Les excursions sur les dunes de Titan sont fascinantes. Prévoir des vêtements chauds."),
        # Vénus Cloud9
        (places[5], guest, 4, "La cité flottante est magnifique, flotter au-dessus des nuages de Vénus est vertigineux. Le restaurant avec terrasse pressurisée offre une vue incroyable. Le voyage est long mais ça vaut le détour."),
        (places[5], host1, 3, "Concept génial et architecture impressionnante, mais encore quelques ajustements à faire sur la stabilisation de la plateforme. Par vent fort, ça tangue légèrement."),
        (places[5], admin, 4, "Les couchers de soleil qui durent des semaines, c'est une expérience contemplative unique. Le centre de recherche ouvert aux visiteurs est passionnant. Hâte que la phase 2 de la cité soit terminée."),
        (places[5], host2, 5, "J'y retourne pour la deuxième fois et je suis toujours aussi impressionnée. La haute atmosphère de Vénus est le secret le mieux gardé du tourisme spatial."),
    ]

    for place, user, rating, text in reviews_data:
        r = Review(
            text=text,
            rating=rating,
            user_id=user.id,
            place_id=place.id,
        )
        db.session.add(r)

    db.session.commit()
    print(f"Seed complete: {len(places)} places, {len(reviews_data)} reviews, 3 users, {len(amenities)} amenities")
