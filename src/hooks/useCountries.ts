import { useGetAllCountriesQuery } from "@/store/countryApi";
import { useQuery } from "@tanstack/react-query";
import { Country } from "@/types/country";

export function useCountries() {
  const { data } = useGetAllCountriesQuery();

  return useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      if (!data) throw new Error("Countries not loaded");
      return data;
    },
    enabled: !!data,
    staleTime: Infinity,
  });
}
