import MobileBottomBar from "../../components/payments/MobileBottomBar";

export default function WithdrawPage() {
    return(
        <>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Withdraw Funds</h1>
          <p className="text-gray-600">This is the withdraw page.</p>
           <MobileBottomBar />
        </div>
        </>
    )
}