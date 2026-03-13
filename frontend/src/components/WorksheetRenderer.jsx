import OffeneFragen from "@/components/worksheets/OffeneFragen"
import Interview from "@/components/worksheets/Interview"
import Kreise from "@/components/worksheets/Kreise"
import Tabelle from "@/components/worksheets/Tabelle"
import Kontaktform  from "@/components/worksheets/Kontaktform"
import Checkliste from "@/components/worksheets/Checkliste"
import FragenTabellen from "@/components/worksheets/FragenTabellen"
import Informationstext from "@/components/worksheets/Informationstext"





export default function WorksheetRenderer({ worksheetId }) {
  switch (worksheetId) {
    case "ws-offene-fragen":
      return <OffeneFragen />

    case "ws-interview":
      return <Interview />

    case "ws-kreise":
      return <Kreise />

    case "ws-tabelle":
      return <Tabelle />

      case "ws-kontaktform":
          return <Kontaktform />

          case "ws-checkliste":
              return <Checkliste />

                 case "ws-fragen-tabelle":
                        return <FragenTabellen />

                        case "ws-text":
                            return <Informationstext />

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