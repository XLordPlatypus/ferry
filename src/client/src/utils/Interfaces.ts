export interface Route {
    from_destination: string;
    to_destination: string;
    subtitle: string;
    _id: string;
    __v?: number;
}

export interface Ferry {
    name: string;
    _id: string;
    __v?: number;
}

export interface Trip {
    _id: string;
    route: Route;
    departure_time: string;
    arrival_time: string;
    minPrice: number;
    ferry: Ferry;
    __v?: number;
}

export interface Sizes {
    _id: string;
    label: string;
    min: number;
    max: number;
    __v?: number;
}

export interface VehicleSizes {
    vehicleHeight: Sizes[],
    vehicleLength: Sizes[],
    trailerLength: Sizes[]
}

export interface CustomerData {
    _id?: string;
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: string;
    email: string;
    phone_number: string;
    nationality: string;
    driver_license: {
        country_code: string;
        license_number: string;
        date_of_issue: string;
    };
    address: {
        city: string;
        postal_code: string;
        house_number: string;
        house_number_addon: string;
        street: string;
    };
}

export interface VehicleDetails {
    motorcycle: boolean;
    height: any;
    length: any;
    trailer: {
        exists: boolean;
        length: any;
    };
}

export interface Booking {
    _id: string;
    status: string;
    price: number;
    vehicle: {
        trailer: {
            length: {
                label: string;
                min: number;
                max: number;
                _id: string;
            };
            exists: boolean;
        };
        motorcycle: boolean;
        height: {
            label: string;
            min: number;
            max: number;
            _id: string;
        };
        length: {
            label: string;
            min: number;
            max: number;
            _id: string;
        };
        _id: string;
    };
    customers: Array<{
        driver_license: {
            country_code: string;
            license_number: string;
            date_of_issue: string;
        };
        address: {
            city: string;
            postal_code: string;
            house_number: string;
            house_number_addon: string;
            street: string;
        };
        firstname: string;
        lastname: string;
        birthdate: string;
        gender: string;
        email: string;
        phone_number: string;
        nationality: string;
        _id: string;
    }>;
    trip: {
        route: {
            from_destination: string;
            to_destination: string;
            subtitle: string;
            _id: string;
        };
        departure_time: string;
        arrival_time: string;
        minPrice: number;
        ferry: {
            name: string;
            _id: string;
        };
        _id: string;
    };
}
