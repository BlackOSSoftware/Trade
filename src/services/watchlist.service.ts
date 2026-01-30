import api from "@/api/axios";
import tradeApi from "@/api/tradeApi";
export type WatchlistItem = {
    [x: string]: string;
    _id: string;
    code: string;
    name: string;
};


export type InstrumentItem = {
    code: string;
    name: string;
    segment: string;
    isAdded?: boolean;
};
type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export const fetchWatchlist = async (limit = 50) => {
  const { data } = await tradeApi.get("/watchlist", {
    params: { limit },
  });

  return data.data;
};


export async function searchInstruments(
    query: string,
    limit = 40
): Promise<InstrumentItem[]> {
    const res = await api.get<ApiResponse<InstrumentItem[]>>(
        `/watchlist/search/instruments`,
        {
            params: {
                q: query,
                limit,
            },
        }
    );

    return res.data.data;
}

/* ================= SEGMENT ================= */

export async function fetchBySegment(
    segment: string,
    accountId: string,
    limit = 40
): Promise<InstrumentItem[]> {
    const res = await api.get<ApiResponse<InstrumentItem[]>>(
        `/watchlist/segment/${segment}`,
        {
            params: {
                accountId,
                limit,
            },
        }
    );

    return res.data.data;
}

/* ================= ADD ================= */

export async function addToWatchlist(
    accountId: string,
    code: string
) {
    const res = await api.post(
        `/watchlist/add`,
        { code },
        {
            params: {
                accountId,
            },
        }
    );

    return res.data.data;
}

/* ================= REMOVE ================= */

export async function removeFromWatchlist(
    accountId: string,
    code: string
) {
    const res = await api.delete(
        `/watchlist/remove/${code}`,
        {
            params: {
                accountId,
            },
        }
    );

    return res.data.success;
}