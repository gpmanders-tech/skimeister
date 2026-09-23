/** Blogartikelen voor SEO. Voeg eenvoudig nieuwe posts toe aan de array. */

export interface BlogBlock {
  heading?: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // yyyy-mm-dd
  readingMinutes: number;
  blocks: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "hoe-word-je-skileraar",
    title: "Hoe word je skileraar?",
    excerpt:
      "Van eerste bocht tot betaalde baan op de piste: dit zijn de stappen om gecertificeerd skileraar te worden.",
    date: "2025-11-03",
    readingMinutes: 5,
    blocks: [
      {
        body: "Skileraar worden is voor veel wintersporters een droom: betaald worden om de hele dag op de piste te staan. Maar hoe begin je? In dit artikel zetten we de route op een rij.",
      },
      {
        heading: "1. Zorg dat je goed kunt skiën",
        body: "Voordat je begint aan een opleiding moet je zelf vlot en gecontroleerd kunnen skiën op rode en zwarte pistes. Veel opleidingen hebben een instaptoets.",
      },
      {
        heading: "2. Kies een opleiding en niveau",
        body: "In Nederland kun je terecht bij NEVSKI, internationaal zijn er BASI (VK) en ÖSV (Oostenrijk). Het Oostenrijkse Anwärter-diploma is het minimumniveau om bij veel skischolen aan de slag te gaan.",
      },
      {
        heading: "3. Behaal je certificaat",
        body: "Een opleiding combineert theorie (didactiek, veiligheid, sneeuwkunde) met veel praktijk. Reken op een aantal weken training en een examen.",
      },
      {
        heading: "4. Vind werk",
        body: "Met je certificaat op zak kun je je aanmelden bij skischolen, reisorganisaties en scholen. Op Skimeister.nl maak je gratis een profiel aan en word je gevonden door partijen die instructeurs zoeken.",
      },
      {
        heading: "5. Regel je VOG en EHBO",
        body: "Wie met groepen werkt, en zeker met kinderen, heeft naast een diploma een geldige VOG en een EHBO-certificaat nodig. Bij groepen met kinderen is een VOG verplicht. Op Skimeister upload je beide documenten één keer; wij controleren ze handmatig en zetten daarna een badge op je profiel.",
      },
      {
        heading: "Nog niet gecertificeerd?",
        body: "Meld je dan alvast gratis aan als aspirant. Dan volgen we je voortgang en kun je je certificaat uploaden zodra je het hebt. Zo sta je klaar zodra de opdrachten voor het nieuwe seizoen binnenkomen.",
      },
    ],
  },
  {
    slug: "wat-verdient-een-skileraar",
    title: "Wat verdient een skileraar?",
    excerpt:
      "Uurtarieven, dagtarieven en seizoenscontracten: een realistisch beeld van wat je als skileraar kunt verdienen.",
    date: "2025-11-17",
    readingMinutes: 4,
    blocks: [
      {
        body: "Het inkomen van een skileraar hangt sterk af van je niveau, ervaring, gebied en het type werkgever. Toch zijn er duidelijke richtlijnen.",
      },
      {
        heading: "Uur- en dagtarieven",
        body: "Beginnende instructeurs werken vaak op uur- of dagbasis. Naarmate je hogere certificeringen (zoals ISIA) haalt, stijgt je tarief mee.",
      },
      {
        heading: "Seizoenscontracten",
        body: "Veel skischolen en reisorganisaties werken met seizoenscontracten, vaak inclusief reis en verblijf. Dat maakt een vergelijking op kaal uurloon lastig. Kijk altijd naar het totaalplaatje.",
      },
      {
        heading: "Hoe verhoog je je waarde?",
        body: "Hogere certificeringen, meerdere talen, ervaring met kinderen of schoolgroepen, en goede reviews maken je aantrekkelijker, en daarmee beter betaald.",
      },
      {
        heading: "Waar let je op bij het vergelijken?",
        body: "Kijk niet alleen naar het bedrag, maar ook naar wat erbij hoort: is reis en verblijf geregeld, om hoeveel dagen gaat het en voor welke groep sta je? Een week met een schoolgroep vraagt iets anders dan een heel seizoen bij een skischool.",
      },
      {
        heading: "De vergoeding staat er gewoon bij",
        body: "Op Skimeister staat bij elke opdracht de vergoeding vermeld, naast het skigebied, de periode en de gevraagde certificering. Zo weet je vooraf waar je aan toe bent en hoef je niet te solliciteren om erachter te komen wat een opdracht oplevert. Voor skileraren is het platform altijd gratis.",
      },
    ],
  },
  {
    slug: "top-skigebieden-voor-instructeurs",
    title: "Top skigebieden voor instructeurs",
    excerpt:
      "Waar werk je als skileraar het fijnst? Een overzicht van populaire gebieden in Oostenrijk en de Alpen.",
    date: "2025-12-01",
    readingMinutes: 4,
    blocks: [
      {
        body: "Niet elk skigebied is even geschikt om in te werken. Sfeer, type gasten en sneeuwzekerheid maken verschil. Dit zijn enkele favorieten.",
      },
      {
        heading: "Sneeuwzekere klassiekers",
        body: "Gebieden als St. Anton, Ischgl en Sölden staan bekend om hun sneeuwzekerheid en uitgestrekte pistes: ideaal voor een heel seizoen werk.",
      },
      {
        heading: "Familievriendelijk",
        body: "Saalbach-Hinterglemm, Zell am See en Schladming trekken veel families en schoolgroepen, met veel vraag naar Nederlandstalige instructeurs.",
      },
      {
        heading: "Vind werk per gebied",
        body: "Op Skimeister.nl heeft elk skigebied een eigen pagina waar organisaties instructeurs zoeken. Geef je voorkeursgebieden op in je profiel om gericht gevonden te worden.",
      },
      {
        heading: "Welk diploma vraagt men per land?",
        body: "In Oostenrijk werkt vrijwel elke skischool met de ÖSV-niveaus, van Anwärter tot Staatlich geprüfter Schilehrer; Nederlandse NEVSKI-diploma's en de ISIA-stamp worden daarnaast breed geaccepteerd. Zwitserse skischolen werken met Swiss Snowsports, en voor buitenlandse instructeurs is de ISIA-stamp daar vaak doorslaggevend. Frankrijk stelt de zwaarste eisen: voor betaald lesgeven is in de praktijk een Diplôme d'État of een gelijkwaardige erkenning met ISIA-stamp nodig.",
      },
      {
        heading: "Kies wat bij je past",
        body: "Wil je een heel seizoen op één plek staan, dan telt sneeuwzekerheid zwaar. Werk je liever een paar weken met groepen, dan zijn de familiegebieden met veel Nederlandse en Belgische gasten een logische keuze. Bekijk de open opdrachten om te zien waar nu vraag is.",
      },
    ],
  },
];

export const getPostBySlug = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);
