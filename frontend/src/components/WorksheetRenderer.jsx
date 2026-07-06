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

//restliche ABs:
import InterviewLeitfadenTemplate from "@/components/worksheets/rest/InterviewLeitfadenTemplate"
import PartnerKreiseTemplate from "@/components/worksheets/rest/PartnerKreiseTemplate"
import TabelleTemplate2 from "@/components/worksheets/rest/TabelleTemplate"
import VertragMitMirSelbstTemplate from "@/components/worksheets/rest/VertragMitMirSelbstTemplate"
import WunschlebenslaufTemplate from "@/components/worksheets/rest/WunschlebenslaufTemplate"

// Content-JSONs
import informationstextBerufsorientierung from "@/data/ABs/templates/informationstext-berufsorientierung.json"
import interviewBerufsorientierung from "@/data/ABs/templates/interview-berufsorientierung.json"
import offeneFragenBerufsorientierung from "@/data/ABs/templates/offenefragen.json"
import kreiseBerufsorientierung from "@/data/ABs/templates/kreise.json"
import tabelleBerufsvergleich from "@/data/ABs/templates/tabelle.json"
import checklisteFremdeinschaetzung from "@/data/ABs/templates/checkliste.json"
import fragenTabellenBerufsorientierung from "@/data/ABs/templates/fragentabellen.json"
import selbstbild from "@/data/ABs/m2/m2-selbstbild.json"
import fremdbild from "@/data/ABs/m2/m2-fremdbild.json"
import offeneFragenStaerkenWerteZiele from "@/data/ABs/m2/m2-meine-staerken-werte-ziele.json"
import werteZieleAllgemein from "@/data/ABs/m2/m2-werte-ziele-allgemein.json"
import werteZieleBerufsbezogen from "@/data/ABs/m2/m2-werte-ziele-berufsbezogen.json"
import interessenAufDerSpur from "@/data/ABs/m2/m2-interessen-auf-der-spur.json"
import aktivitaetenNaechsteSchritte from "@/data/ABs/m2/m2-aktivitaeten-naechste-schritte.json"
import rechercheNaechsteSchritte from "@/data/ABs/m2/m2-recherche-naechste-schritte.json"
import berufsvorschlaege from "@/data/ABs/m2/m2-berufsvorschlaege.json"
import ergebnissicherung from "@/data/ABs/m2/m2-ergebnissicherung.json"
import wegweiserIntro from "@/data/ABs/m1/m1-wegweiser.json"



//restliche ABs:
import a1BlickInDieZukunft from "@/data/ABs/rest/a1-blick-in-die-zukunft.json"
import a2PersoenlicheZukunft from "@/data/ABs/rest/a2-meine-persoenliche-zukunft.json"
import a3ZukunftsbilderChecklist from "@/data/ABs/rest/a3a-zukunftsbilder-checkliste.json"
import a3ZukunftsbilderReflexion from "@/data/ABs/rest/a3b-zukunftsbilder-reflexion.json"
import b1BerufsStudienwahlpartner from "@/data/ABs/rest/b1-berufs-studienwahlpartner.json"
import b2BlitzlichtInterview from "@/data/ABs/rest/b2-blitzlicht-interview.json"
import b3Planungsaktivitaeten from "@/data/ABs/rest/b3-planungsaktivitaeten.json"
import c1aBerufshitliste from "@/data/ABs/rest/c1a-berufshitliste.json"
import c1bStudienhitliste from "@/data/ABs/rest/c1b-studienhitliste.json"
import c2BerufeInterview from "@/data/ABs/rest/c2-berufe-interview.json"
import c3Interviewregeln from "@/data/ABs/rest/c3-interviewregeln.json"
import c4Praxiskontakte from "@/data/ABs/rest/c4-leitfaden-praxiskontakte.json"
import d1aRealitaetscheckBeruf from "@/data/ABs/rest/d1a-realitaetscheck-berufshitliste.json"
import d1bRealitaetscheckStudium from "@/data/ABs/rest/d1b-realitaetscheck-studienhitliste.json"
import d2Informationsangebote from "@/data/ABs/rest/d2-checkliste-informationsangebote.json"
import d3Entscheidungspartner from "@/data/ABs/rest/d3-entscheidungspartner.json"
import e1MeinPortfolio from "@/data/ABs/rest/e1-mein-portfolio.json"
import e2VertragMitMirSelbst from "@/data/ABs/rest/e2-vertrag-mit-mir-selbst.json"
import e3Wunschlebenslauf from "@/data/ABs/rest/e3-wunschlebenslauf.json"
import e4aExpertenInterviewBeruf from "@/data/ABs/rest/e4a-experten-interview-beruf.json"
import e4bExpertenInterviewStudium from "@/data/ABs/rest/e4b-experten-interview-studium.json"


// Für jedes weitere Arbeitsblatt desselben Typs: neue JSON-Datei anlegen,
// hier importieren, und unten einen neuen case hinzufügen. Beispiel:
// import interviewStaerken from "@/data/arbeitsblaetter/interview-staerken.json"

export default function WorksheetRenderer({ worksheetId }) {
  switch (worksheetId) {
    case "ws-offene-fragen":
      return <OffeneFragenTemplate {...offeneFragenBerufsorientierung} worksheetId={worksheetId} />

    case "ws-interview":
      return <InterviewTemplate {...interviewBerufsorientierung} worksheetId={worksheetId} />

    case "ws-kreise":
      return <KreiseTemplate {...kreiseBerufsorientierung} worksheetId={worksheetId} />

    case "ws-tabelle":
      return <TabelleTemplate {...tabelleBerufsvergleich} worksheetId={worksheetId} />

    case "ws-kontaktform":
      return <Kontaktform />

    case "ws-checkliste":
      return <ChecklisteTemplate {...checklisteFremdeinschaetzung} worksheetId={worksheetId} />

    case "ws-fragen-tabelle":
      return <FragenTabellenTemplate {...fragenTabellenBerufsorientierung} worksheetId={worksheetId} />

    case "ws-text":
      return <InformationstextTemplate {...informationstextBerufsorientierung} worksheetId={worksheetId} />

    case "ws-selbstbild":
      return <KompetenzskalaTemplate {...selbstbild} worksheetId={worksheetId} />

    case "ws-fremdbild":
      return <KompetenzskalaTemplate {...fremdbild} worksheetId={worksheetId} />

    // Beispiel für ein weiteres Arbeitsblatt desselben Typs:
    // case "ws-interview-staerken":
    //     return <InterviewTemplate {...interviewStaerken} worksheetId={worksheetId} />

    case "ws-staerken-werte-ziele":
        return <OffeneFragenTemplate {...offeneFragenStaerkenWerteZiele} worksheetId={worksheetId} />

    case "ws-werte-ziele-allgemein":
        return <KompetenzskalaTemplate {...werteZieleAllgemein} worksheetId={worksheetId} />

    case "ws-werte-ziele-berufsbezogen":
        return <KompetenzskalaTemplate {...werteZieleBerufsbezogen} worksheetId={worksheetId} />

    case "ws-interessen-auf-der-spur":
        return <FragenTabellenTemplate {...interessenAufDerSpur} worksheetId={worksheetId} />

    case "ws-aktivitaeten-naechste-schritte":
        return <OffeneFragenTemplate {...aktivitaetenNaechsteSchritte} worksheetId={worksheetId} />

    case "ws-recherche-naechste-schritte":
        return <OffeneFragenTemplate {...rechercheNaechsteSchritte} worksheetId={worksheetId} />

    case "ws-berufsvorschlaege":
        return <BerufsvorschlaegeTemplate {...berufsvorschlaege} worksheetId={worksheetId} />

    case "ws-ergebnissicherung":
        return <ErgebnissicherungTemplate {...ergebnissicherung} worksheetId={worksheetId} />

    case "ws-wegweiser-intro":
        return <InformationstextTemplate {...wegweiserIntro} worksheetId={worksheetId} />







    //restliche ABs:
    case "ws-a1-blick-in-die-zukunft":
          return <OffeneFragenTemplate {...a1BlickInDieZukunft} />

        case "ws-a2-persoenliche-zukunft":
          return <OffeneFragenTemplate {...a2PersoenlicheZukunft} />

        case "ws-a3-zukunftsbilder-checkliste":
          return <ChecklisteTemplate {...a3ZukunftsbilderChecklist} />

        case "ws-a3-zukunftsbilder-reflexion":
          return <OffeneFragenTemplate {...a3ZukunftsbilderReflexion} />

        case "ws-b1-berufs-studienwahlpartner":
          return <PartnerKreiseTemplate {...b1BerufsStudienwahlpartner} />

        case "ws-b2-blitzlicht-interview":
          return <InterviewLeitfadenTemplate {...b2BlitzlichtInterview} />

        case "ws-b3-planungsaktivitaeten":
          return <TabelleTemplate2 {...b3Planungsaktivitaeten} />

        case "ws-c1a-berufshitliste":
          return <TabelleTemplate2 {...c1aBerufshitliste} />

        case "ws-c1b-studienhitliste":
          return <TabelleTemplate2 {...c1bStudienhitliste} />

        case "ws-c2-berufe-interview":
          return <InterviewLeitfadenTemplate {...c2BerufeInterview} />

        case "ws-c3-interviewregeln":
          return <InformationstextTemplate {...c3Interviewregeln} />

        case "ws-c4-praxiskontakte":
          return <OffeneFragenTemplate {...c4Praxiskontakte} />

        case "ws-d1a-realitaetscheck-beruf":
          return <TabelleTemplate2 {...d1aRealitaetscheckBeruf} />

        case "ws-d1b-realitaetscheck-studium":
          return <TabelleTemplate2 {...d1bRealitaetscheckStudium} />

        case "ws-d2-informationsangebote":
          return <PartnerKreiseTemplate {...d2Informationsangebote} />

        case "ws-d3-entscheidungspartner":
          return <PartnerKreiseTemplate {...d3Entscheidungspartner} />

        case "ws-e1-mein-portfolio":
          return <OffeneFragenTemplate {...e1MeinPortfolio} />

        case "ws-e2-vertrag-mit-mir-selbst":
          return <VertragMitMirSelbstTemplate {...e2VertragMitMirSelbst} />

        case "ws-e3-wunschlebenslauf":
          return <WunschlebenslaufTemplate {...e3Wunschlebenslauf} />

        case "ws-e4a-experten-interview-beruf":
          return <InterviewLeitfadenTemplate {...e4aExpertenInterviewBeruf} />

        case "ws-e4b-experten-interview-studium":
          return <InterviewLeitfadenTemplate {...e4bExpertenInterviewStudium} />


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