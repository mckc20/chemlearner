import { profileText } from './elementProfile'

export const helpContent = {
  en: {
    title: 'Help', intro: 'Your guide to exploring compounds, understanding elements and practising chemistry with ChemLearner.', contents: 'On this page', back: 'Open the periodic table',
    sections: [
      { id: 'getting-started', title: 'Getting started', paragraphs: [
        'Use the Library menu to open the Molecule Library or the Periodic Table of Elements. You can return to the start page by selecting ChemLearner in the header.',
        'Switch between English and German with DE / EN. The theme controls let you choose light, dark or your device’s appearance. Language and theme preferences are remembered in this browser.',
      ] },
      { id: 'compound-library', title: 'Compound library and molecular models', paragraphs: [
        'Search the library and filter by category to find a compound. Open a compound to see its formula, educational facts, reference links and available 2D / 3D structures. Drag the 3D model to rotate it and zoom to inspect it.',
        'Select compounds with the checkboxes. Select exactly two to compare them, or at least two to start a compound quiz. Export the selected compounds as a CSV file using Export CSV.',
        'Some formulas describe more than one compound. The viewer can flag this ambiguity; a formula alone does not establish the identity of a substance. Structure loading requires an internet connection and may be unavailable for some compounds.',
      ] },
      { id: 'compound-quizzes', title: 'Compound quizzes and history', paragraphs: [
        'Choose a quiz type: formula from name, name from formula, name from structure, structure from name, category from structure, or general knowledge. Choose the number of questions offered by the setup screen.',
        'Review your results when a round finishes, retry the quiz or practise your mistakes. Quiz History lets you review previous compound quiz results, retry them, practise mistakes or delete saved results.',
      ] },
      { id: 'element-profiles', title: 'Periodic table and element profiles', paragraphs: [
        'Click an element in the reference table, or focus it and press Enter or Space, to open its profile. Overview, Atomic structure, Properties and Isotopes contain the reference information. Previous and next move in atomic-number order, retaining your tab and resetting isotope and charge.',
        'Choose an isotope or a supported ion below the animation. The particle counts, shells and electron configuration stay synchronized. Changing the isotope preserves the charge, and changing the charge preserves the isotope. The default is a neutral atom with the most abundant source-documented natural isotope, or an explicitly selected representative isotope.',
        'Bulk properties describe the element rather than the selected isotope or ion. Missing values and predictions are marked. Source links, data edition and retrieval dates are available inside the profile. Compound links open the existing viewer; closing it restores your profile and selections.',
        'Use the arrow keys, Home and End within the tab bar. Tab moves between controls, and Escape closes a dialog. You can also close a profile with its close button or by clicking the backdrop.',
      ] },
      { id: 'atom-animation', title: 'Atom animation', paragraphs: [
        'The atom drawing is a simplified shell model, not to scale. It illustrates shell populations rather than the paths electrons take in a real atom.',
        'The nucleus is a compact illustration: it may use fewer dots than the actual number of particles. The exact proton, neutron and electron counts are displayed beneath the animation.',
        'Electron motion is illustrative. The animation speed does not represent measured electron speed. The grey pause-circle button in the bottom-right corner pauses it; the play-circle button resumes it. If your device requests reduced motion, the animation starts paused.',
      ] },
      { id: 'electron-configurations', title: 'Electron configurations and bonding', paragraphs: ['simplified', 'selectShell', 'bonding', 'transition'].map(key => profileText('en', key)) },
      { id: 'element-properties', title: 'Understanding element properties', paragraphs: ['isotopeWeight', 'bulkNote', 'radiusNote'].map(key => profileText('en', key)) },
      { id: 'isotope-data', title: 'Reading isotope data', paragraphs: ['defaultNote', 'isotopeNote', 'decayLegend'].map(key => profileText('en', key)) },
      { id: 'element-data-sources', title: 'Element data sources', providers: true, paragraphs: [
        'Each element profile has one expandable Sources section. It lists only sources used for that element and names the facts each one supports. The links open external sites and need an internet connection.',
        'PubChem brings together element data from several contributors. Where a contributor’s old page no longer provides the record, the element’s PubChem page retains the value and contributor attribution. The short English and German descriptions are original teaching summaries based on those element records.',
        'The data edition and retrieval date describe the bundled snapshot, not a live update. Some values depend on the sample, pressure, temperature or allotrope; missing conditions are marked. Predicted and unavailable values are labelled. The isotope table is a selected teaching collection, not a complete list of nuclides.',
      ] },
      { id: 'periodic-quizzes', title: 'Periodic table quizzes', paragraphs: [
        'Select Quiz on the reference table to choose Self-test, Find the element or Element questions. Self-test lets you reveal and hide table cells. Find the element asks you to locate an element. Element questions asks for selected details such as a symbol, name, atomic number or family.',
        'Where available, settings let you select families, round length and answer feedback. Settings changed during a round can be applied to the next round or used to restart. Reference profiles open from the reference table; quiz cells keep their quiz interactions.',
      ] },
      { id: 'data-and-offline', title: 'Saved data, sources and offline use', paragraphs: [
        'The library, compound quiz history and saved preferences use this browser’s local storage. They are not an account-based cloud backup. Clearing site data, using another browser or using private browsing can affect what is available.',
        'Element profiles use bundled reference data described in Element data sources. Once the app is loaded, you can explore profiles without a network connection. A first visit or reload may still require a connection; molecular structure retrieval and external source links also require one.',
      ] },
    ],
  },
  de: {
    title: 'Hilfe', intro: 'Dein Leitfaden zum Erkunden von Verbindungen, Verstehen von Elementen und Üben mit ChemLearner.', contents: 'Auf dieser Seite', back: 'Periodensystem öffnen',
    sections: [
      { id: 'getting-started', title: 'Erste Schritte', paragraphs: [
        'Öffne über das Menü Bibliothek die Molekülbibliothek oder das Periodensystem der Elemente. Mit ChemLearner in der Kopfzeile gelangst du zur Startseite.',
        'Mit DE / EN wechselst du zwischen Deutsch und Englisch. Die Darstellung kann hell, dunkel oder an dein Gerät angepasst sein. Sprache und Darstellung werden in diesem Browser gespeichert.',
      ] },
      { id: 'compound-library', title: 'Verbindungsbibliothek und Molekülmodelle', paragraphs: [
        'Durchsuche die Bibliothek und filtere nach Kategorie. Öffne eine Verbindung, um ihre Formel, Lerninformationen, Quellenlinks und verfügbare 2D- / 3D-Strukturen zu sehen. Ziehe das 3D-Modell zum Drehen und zoome für eine genauere Ansicht.',
        'Wähle Verbindungen über die Kontrollkästchen aus. Genau zwei Verbindungen lassen sich vergleichen; mit mindestens zwei kannst du ein Verbindungsquiz starten. Über CSV exportieren lädst du die ausgewählten Verbindungen als CSV-Datei herunter.',
        'Eine Formel kann mehrere Verbindungen beschreiben. Die Ansicht kann auf diese Mehrdeutigkeit hinweisen; die Formel allein bestimmt nicht die Identität eines Stoffes. Das Laden von Strukturen benötigt eine Internetverbindung und ist nicht für jede Verbindung verfügbar.',
      ] },
      { id: 'compound-quizzes', title: 'Verbindungsquiz und Verlauf', paragraphs: [
        'Wähle den Quiztyp: Formel aus Name, Name aus Formel, Name aus Struktur, Struktur aus Name, Kategorie aus Struktur oder Allgemeinwissen. Die Einrichtung zeigt die verfügbare Anzahl an Fragen.',
        'Nach einer Runde kannst du die Ergebnisse ansehen, das Quiz wiederholen oder Fehler üben. Im Quizverlauf kannst du frühere Ergebnisse von Verbindungsquizzen ansehen, Runden wiederholen, Fehler üben und gespeicherte Ergebnisse löschen.',
      ] },
      { id: 'element-profiles', title: 'Periodensystem und Elementprofile', paragraphs: [
        'Klicke in der Referenztabelle auf ein Element oder fokussiere es und drücke Enter oder die Leertaste. Übersicht, Atombau, Eigenschaften und Isotope enthalten die Referenzinformationen. Vorheriges und nächstes Element folgen der Ordnungszahl; der Bereich bleibt gewählt, Isotop und Ladung werden zurückgesetzt.',
        'Wähle unter der Animation ein Isotop oder ein unterstütztes Ion. Teilchenzahlen, Schalen und Elektronenkonfiguration bleiben aufeinander abgestimmt. Ein Isotopwechsel erhält die Ladung, ein Ladungswechsel das Isotop. Standard ist ein neutrales Atom mit dem häufigsten natürlichen Isotop laut Quelle oder einem ausdrücklich gewählten repräsentativen Isotop.',
        'Stoffeigenschaften beschreiben das Element und nicht das gewählte Isotop oder Ion. Fehlende Werte und Vorhersagen sind gekennzeichnet. Quellenlinks, Datenausgabe und Abrufdatum stehen im Profil. Verbindungslinks öffnen die bestehende Ansicht; beim Schließen kehrst du zum Profil mit deiner Auswahl zurück.',
        'In der Bereichsleiste funktionieren die Pfeiltasten sowie Pos1 und Ende. Tab wechselt zwischen Bedienelementen, Escape schließt einen Dialog. Ein Profil lässt sich auch mit dem Schließen-Symbol oder durch Klicken auf den Hintergrund schließen.',
      ] },
      { id: 'atom-animation', title: 'Atomanimation', paragraphs: [
        'Die Atomdarstellung ist ein vereinfachtes Schalenmodell und nicht maßstabsgetreu. Sie veranschaulicht die Schalenbesetzung, nicht die tatsächlichen Bahnen von Elektronen in einem Atom.',
        'Der Kern ist eine kompakte Illustration: Er kann weniger Punkte als tatsächliche Teilchen enthalten. Die genauen Protonen-, Neutronen- und Elektronenzahlen stehen unter der Animation.',
        'Die Elektronenbewegung dient der Veranschaulichung. Ihre Geschwindigkeit entspricht keiner gemessenen Elektronengeschwindigkeit. Das graue Pause-Symbol im Kreis unten rechts hält die Animation an; das Wiedergabesymbol im Kreis setzt sie fort. Wenn dein Gerät reduzierte Bewegung anfordert, startet die Animation pausiert.',
      ] },
      { id: 'electron-configurations', title: 'Elektronenkonfiguration und Bindungen', paragraphs: ['simplified', 'selectShell', 'bonding', 'transition'].map(key => profileText('de', key)) },
      { id: 'element-properties', title: 'Elementeigenschaften verstehen', paragraphs: ['isotopeWeight', 'bulkNote', 'radiusNote'].map(key => profileText('de', key)) },
      { id: 'isotope-data', title: 'Isotopendaten lesen', paragraphs: ['defaultNote', 'isotopeNote', 'decayLegend'].map(key => profileText('de', key)) },
      { id: 'element-data-sources', title: 'Quellen der Elementdaten', providers: true, paragraphs: [
        'Jedes Elementprofil hat einen ausklappbaren Quellenbereich. Er enthält nur Quellen, die für dieses Element verwendet werden, und nennt die Angaben, die sie belegen. Die externen Links benötigen eine Internetverbindung.',
        'PubChem bündelt Elementdaten verschiedener beitragender Stellen. Wenn eine frühere Seite einer solchen Stelle nicht mehr zum Datensatz führt, zeigt die PubChem-Elementseite den Wert mit der ursprünglichen Quellenangabe. Die kurzen deutschen und englischen Texte sind eigenständige Lernzusammenfassungen auf Grundlage dieser Elementdatensätze.',
        'Datenausgabe und Abrufdatum bezeichnen den mitgelieferten Datenstand, keine Live-Aktualisierung. Einige Werte hängen von Probe, Druck, Temperatur oder Modifikation ab; fehlende Bedingungen sind gekennzeichnet. Vorhersagen und nicht verfügbare Werte werden markiert. Die Isotopentabelle ist eine Auswahl für Lernzwecke und keine vollständige Nuklidliste.',
      ] },
      { id: 'periodic-quizzes', title: 'Periodensystem-Quiz', paragraphs: [
        'Über Quiz in der Referenztabelle wählst du Selbsttest, Element finden oder Elementfragen. Im Selbsttest kannst du Tabellenfelder auf- und zudecken. Bei Element finden suchst du ein Element. Elementfragen fragt ausgewählte Angaben wie Symbol, Name, Ordnungszahl oder Elementfamilie ab.',
        'Je nach Modus lassen sich Elementfamilien, Rundenlänge und die Rückmeldung auf Antworten einstellen. Änderungen während einer Runde können für die nächste Runde übernommen oder für einen Neustart genutzt werden. Elementprofile öffnen sich aus der Referenztabelle; Quizfelder behalten ihre Quizfunktion.',
      ] },
      { id: 'data-and-offline', title: 'Gespeicherte Daten, Quellen und Offline-Nutzung', paragraphs: [
        'Bibliothek, Verlauf der Verbindungsquizze und gespeicherte Einstellungen verwenden den lokalen Speicher dieses Browsers. Es gibt keine kontobasierte Cloud-Sicherung. Das Löschen von Websitedaten, ein anderer Browser oder privates Surfen können die verfügbaren Daten beeinflussen.',
        'Elementprofile verwenden mitgelieferte Referenzdaten, die unter „Quellen der Elementdaten“ erklärt werden. Nach dem Laden der App kannst du Profile ohne Netzwerkverbindung erkunden. Der erste Aufruf oder ein Neuladen kann weiterhin eine Verbindung benötigen; das Laden von Molekülstrukturen und externe Quellenlinks ebenfalls.',
      ] },
    ],
  },
}
