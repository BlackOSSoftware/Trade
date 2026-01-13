import TopBarSlot from "../../components/layout/TopBarSlot";
import TradeTopBar from "../../components/layout/TradeTopBar";

export default function TradeHistory () {
    return(
        <>
             <TopBarSlot>
        <TradeTopBar
          title="History"
          showMenu
          right={
            <div className="flex gap-2">
              
            </div>
          }
        />
      </TopBarSlot>
        </>
    )
}