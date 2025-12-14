import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Country } from "@/types/country";

type RestCountryApiResponse = {
  name: { common: string };
  idd?: { root?: string; suffixes?: string[] };
  flags: { png: string };
};

export const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://restcountries.com/v3.1/",
  }),
  endpoints: (builder) => ({
    getAllCountries: builder.query<Country[], void>({
      query: () => "all?fields=name,idd,flags",
      transformResponse: (response: RestCountryApiResponse[]) => {
        return response
          .map((c) => {
            if (!c.idd?.root || !c.idd.suffixes?.[0]) return null;

            return {
              name: c.name.common,
              dialCode: `${c.idd.root}${c.idd.suffixes[0]}`,
              flag: c.flags.png,
            };
          })
          .filter((c): c is Country => Boolean(c))
          .sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
  }),
});

export const { useGetAllCountriesQuery } = countryApi;
