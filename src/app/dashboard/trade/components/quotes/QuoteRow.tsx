type Props = {
  data: {
    symbol: string;
    change: string;
    percent: string;
    bid: string;
    bidSup: string;
    ask: string;
    askSup: string;
    low: string;
    high: string;
    time: string;
    bars: string;
  };
};

export default function QuoteRow({ data }: Props) {
  return (
    <div className="px-4 py-3 flex justify-between items-start border-b border-black">
      
      {/* LEFT SIDE */}
      <div className="space-y-[2px]">
        {/* Change */}
        <div className="text-xs text-[var(--mt-red)]">
          {data.change} {data.percent}
        </div>

        {/* Symbol */}
        <div className="text-base font-semibold tracking-wide">
          {data.symbol}
        </div>

        {/* Time + bars */}
        <div className="text-xs text-[var(--mt-dim)] flex items-center gap-2">
          <span>{data.time}</span>
          <span>┤</span>
          <span>{data.bars}</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="text-right space-y-[2px]">
        {/* Prices */}
        <div className="flex gap-6 justify-end mt-3">
          
          {/* BID */}
          <div className="text-[18px] font-semibold text-[var(--mt-blue)] leading-none">
            {data.bid}
            <sup className="text-xs ml-[1px] align-super">
              {data.bidSup}
            </sup>
          </div>

          {/* ASK */}
          <div className="text-[18px] font-semibold text-[var(--mt-red)] leading-none">
            {data.ask}
            <sup className="text-xs ml-[1px] align-super">
              {data.askSup}
            </sup>
          </div>
        </div>

        {/* Low / High */}
        <div className="text-xs text-[var(--mt-grey)] ">
          L: {data.low} &nbsp; H: {data.high}
        </div>
      </div>
    </div>
  );
}
