import Kontaktform from "@/components/worksheets/Kontaktform"

// Shablonen (Templates)
import InformationstextTemplate from "@/components/worksheets/Informationstext"
import InterviewTemplate from "@/components/worksheets/Interview"
import OffeneFragenTemplate from "@/components/worksheets/OffeneFragen"
import KreiseTemplate from "@/components/worksheets/Kreise"
import TabelleTemplate from "@/components/worksheets/Tabelle"
import ChecklisteTemplate from "@/components/worksheets/Checkliste"
import FragenTabellenTemplate from "@/components/worksheets/FragenTabellen"
import KompetenzskalaTemplate from "@/components/worksheets/Kompetenzskala"
import ErgebnissicherungTemplate from "@/components/worksheets/Ergebnissicherung"
import BerufsvorschlaegeTemplate from "@/components/worksheets/Berufsvorschlaege"

// Content-JSONs
import informationstextBerufsorientierung from "@/data/ABs/informationstext-berufsorientierung.json"
import interviewBerufsorientierung from "@/data/ABs/interview-berufsorientierung.json"
import offeneFragenBerufsorientierung from "@/data/ABs/offenefragen.json"
import kreiseBerufsorientierung from "@/data/ABs/kreise.json"
import tabelleBerufsvergleich from "@/data/ABs/tabelle.json"
import checklisteFremdeinschaetzung from "@/data/ABs/checkliste.json"
import fragenTabellenBerufsorientierung from "@/data/ABs/fragentabellen.json"
import selbstbild from "@/data/ABs/m2-selbstbild.json"
import fremdbild from "@/data/ABs/m2-fremdbild.json"
import offeneFragenStaerkenWerteZiele from "@/data/ABs/m2-meine-staerken-werte-ziele.json"
import werteZieleAllgemein from "@/data/ABs/m2-werte-ziele-allgemein.json"
import werteZieleBerufsbezogen from "@/data/ABs/m2-werte-ziele-berufsbezogen.json"
import interessenAufDerSpur from "@/data/ABs/m2-interessen-auf-der-spur.json"
import aktivitaetenNaechsteSchritte from "@/data/ABs/m2-aktivitaeten-naechste-schritte.json"
import rechercheNaechsteSchritte from "@/data/ABs/m2-recherche-naechste-schritte.json"
import berufsvorschlaege from "@/data/ABs/m2-berufsvorschlaege.json"
import ergebnissicherung from "@/data/ABs/m2-ergebnissicherung.json"
import wegweiserIntro from "@/data/ABs/m1-wegweiser.json"


// Für jedes weitere Arbeitsblatt desselben Typs: neue JSON-Datei anlegen,
// hier importieren, und unten einen neuen case hinzufügen. Beispiel:
// import interviewStaerken from "@/data/arbeitsblaetter/interview-staerken.json"

export default function WorksheetRenderer({ worksheetId }) {
  switch (worksheetId) {
    case "ws-offene-fragen":
      return <OffeneFragenTemplate {...offeneFragenBerufsorientierung} />

    case "ws-interview":
      return <InterviewTemplate {...interviewBerufsorientierung} />

    case "ws-kreise":
      return <KreiseTemplate {...kreiseBerufsorientierung} />

    case "ws-tabelle":
      return <TabelleTemplate {...tabelleBerufsvergleich} />

    case "ws-kontaktform":
      return <Kontaktform />

    case "ws-checkliste":
      return <ChecklisteTemplate {...checklisteFremdeinschaetzung} />

    case "ws-fragen-tabelle":
      return <FragenTabellenTemplate {...fragenTabellenBerufsorientierung} />

    case "ws-text":
      return <InformationstextTemplate {...informationstextBerufsorientierung} />

    case "ws-selbstbild":
      return <KompetenzskalaTemplate {...selbstbild} />

    case "ws-fremdbild":
      return <KompetenzskalaTemplate {...fremdbild} />

    // Beispiel für ein weiteres Arbeitsblatt desselben Typs:
    // case "ws-interview-staerken":
    //     return <InterviewTemplate {...interviewStaerken} />

    case "ws-staerken-werte-ziele":
        return <OffeneFragenTemplate {...offeneFragenStaerkenWerteZiele} />

    case "ws-werte-ziele-allgemein":
        return <KompetenzskalaTemplate {...werteZieleAllgemein} />

    case "ws-werte-ziele-berufsbezogen":
        return <KompetenzskalaTemplate {...werteZieleBerufsbezogen} />

    case "ws-interessen-auf-der-spur":
        return <FragenTabellenTemplate {...interessenAufDerSpur} />

    case "ws-aktivitaeten-naechste-schritte":
        return <OffeneFragenTemplate {...aktivitaetenNaechsteSchritte} />

    case "ws-recherche-naechste-schritte":
        return <OffeneFragenTemplate {...rechercheNaechsteSchritte} />

    case "ws-berufsvorschlaege":
        return <BerufsvorschlaegeTemplate {...berufsvorschlaege} />

    case "ws-ergebnissicherung":
        return <ErgebnissicherungTemplate {...ergebnissicherung} />

    case "ws-wegweiser-intro":
        return <InformationstextTemplate {...wegweiserIntro} />


    default:
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Dieses Arbeitsblatt ist noch nicht implementiert.
          </h2>
        </div>
      )
  }
}