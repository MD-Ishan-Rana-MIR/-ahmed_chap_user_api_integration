import { baseApi } from "./baseApi";
export interface BusImage {
    id: number;
    image_url: string;
    is_primary: boolean;
}

export interface BusOperator {
    id: number;
    business_name: string;
    phone_number: string;
    city: string;
    country: string;
    profile_image: string | null;
}

export interface BusItem {
    id: number;
    name: string;
    description: string;
    bus_type: string;
    price_per_seat: number;
    currency: string;
    departure_place: string;
    departure_time: string;
    destination_place: string;
    destination_time: string;
    journey_duration: string;
    rest_place: string | null;
    rest_duration: string | null;
    seat_pattern: string;
    driver_position: string;
    total_rows: number;
    back_row_seats: number;
    total_bookable_seats: number;
    has_middle_door: boolean;
    facilities: string[];
    travel_date: string | null;
    available_seats_count: number;
    booked_seats_count: number;
    is_sold_out: boolean;
    primary_image: string;
    images: BusImage[];
    operator: BusOperator;
}

export interface BusPagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_more: boolean;
}

export interface BusesApiResponse {
    status: string;
    message: string;
    data: {
        buses: BusItem[];
        pagination: BusPagination;
    };
}

export interface FetchBusesParams {
    departure_place?: string;
    destination_place?: string;
    travel_date?: string;
    page?: number;
    per_page?: number;
}
export const busApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBuses: builder.query<BusesApiResponse, FetchBusesParams>({
            query: ({
                departure_place,
                destination_place,
                travel_date,
                page = 1,
                per_page = 15,
            }) => {
                let url = `/buses?departure_place=${departure_place}&destination_place=${destination_place}&page=${page}&per_page=${per_page}`;
                if (travel_date) {
                    url += `&travel_date=${travel_date}`;
                }
                return url;
            },
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { departure_place, destination_place, travel_date } = queryArgs;
                return `${endpointName}-${departure_place}-${destination_place}-${travel_date || ""}`;
            },
            merge: (currentCache, newResponse, { arg }) => {
                if (arg.page === 1) {
                    return newResponse;
                }
                currentCache.data.buses.push(...newResponse.data.buses);
                currentCache.data.pagination = newResponse.data.pagination;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
            providesTags: ["Buses"],
        }),
        busDetails : builder.query({
            query : ({id,travel_date})=>({
                url : `/buses/${id}/seat-map?travel_date=${travel_date}`,
                method : "GET"
            }),
            providesTags : ["Buses"]
        }),
        bookingSeat : builder.mutation({
            query : (payload)=>({
                url : `/buses/bookings`,
                method : "POST",
                body : payload
            }),
            invalidatesTags : ["Buses"]
        })
    }),
});

export const {
    useGetBusesQuery,
    useBusDetailsQuery,
    useBookingSeatMutation
} = busApi;