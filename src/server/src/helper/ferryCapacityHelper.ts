import mongoose from "mongoose";
import {tripSchema} from "../schemes/trip/tripSchema";
import {reservationSchema, reservationService} from "../schemes/reservation/reservationSchema";
import {vehicleSchema} from "../schemes/vehicle/vehicleSchema";
import {ferrySchema} from "../schemes/ferry/ferrySchema";

export type Trip = mongoose.InferSchemaType<typeof tripSchema>;
export type Reservation = mongoose.InferSchemaType<typeof reservationSchema>;
export type Vehicle = mongoose.InferSchemaType<typeof vehicleSchema>;

export const hasLowerDeckCapacity = async (trip: Trip & Document) => {
    const lowerCapacity = await calculateLowerDeckCapacity(trip)

    if (!lowerCapacity) {
        return false
    }

    return lowerCapacity > 5
}

export const hasMediumDeckCapacity = async (trip: Trip & Document) =>{
    const mediumCapacity = await calculateMediumDeckCapacity(trip)

    if (!mediumCapacity) {
        return false
    }

    return mediumCapacity > 5

}

export const hasUpperDeckCapacity = async (trip: Trip & Document) => {
    const upperCapacity = await calculateUpperDeckCapacity(trip)

    if (!upperCapacity) {
        return false
    }

    return upperCapacity > 10;
}

export const hasMotorcycleCapacity = async (trip: Trip & Document) => {
    const motorcycleCapacity = await calculateMotorcycleCapacity(trip)

    return motorcycleCapacity > 1;

}

export const hasCapacityForNewVehicle = async (vehicle: Document & Vehicle, trip: Document & Trip) => {
    if (!vehicle.height?.max) {
        return false;
    }

    if (vehicle.motorcycle === true) {
        const motorcycleCapacity = await calculateMotorcycleCapacity(trip);
        return motorcycleCapacity > 0;
    }

    let totalLength = vehicle?.length?.max ?? 0;
    if (vehicle.trailer?.exists === true) {
        totalLength += vehicle.trailer?.length?.max ?? 0;
    }

    if (totalLength <= 0) {
        return false;
    }

    const vehicleHeight = vehicle.height.max;
    const currentDate = new Date();
    const departureDate = new Date(trip.departure_time);
    const daysDifference = Math.floor((departureDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDifference <= 3) {
        const capacities = await Promise.all([
            calculateLowerDeckCapacity(trip),
            calculateMediumDeckCapacity(trip),
            calculateUpperDeckCapacity(trip)
        ]);

        let totalAvailableCapacity = 0;

        if (Array.isArray(capacities)) {
            totalAvailableCapacity = capacities
                .filter((capacity): capacity is number => typeof capacity === 'number' && capacity > 0)
                .reduce((sum, capacity) => sum + capacity, 0);
        }


        return totalAvailableCapacity >= totalLength;
    } else {
        if (vehicleHeight <= 2) {
            const capacity = await calculateLowerDeckCapacity(trip);
            return capacity !== undefined && capacity >= totalLength;
        } else if (vehicleHeight <= 2.6) {
            const capacity = await calculateMediumDeckCapacity(trip);
            return capacity !== undefined && capacity >= totalLength;
        } else {
            const capacity = await calculateUpperDeckCapacity(trip);
            return capacity !== undefined && capacity >= totalLength;
        }
    }
};

const getReservationsByTrip = async (trip: Document & Trip) => {
    let reservations: Array<Reservation> = await reservationService.find();
    return reservations.filter(
        //@ts-ignore
        (reservation) => reservation?.trip?._id?.toString() === trip?._id?.toString()
    );
}

const calculateLowerDeckCapacity = async (trip: Document & Trip) => {
    if (!trip?.ferry?.ferry_capacity?.lower_deck?.space) {
        return undefined;
    }

    const filteredReservations = await getReservationsByTrip(trip);

    const reservations = filteredReservations.filter(reservation => {
        const vehicleHeight = reservation?.vehicle?.height?.max;
        const min = trip?.ferry?.ferry_capacity?.lower_deck?.min;
        const max = trip?.ferry?.ferry_capacity?.lower_deck?.max;

        if (min !== undefined && max !== undefined && vehicleHeight !== undefined) {
            return vehicleHeight <= max && vehicleHeight > min;
        }
        return false;
    });

    let usedCapacity = 0;
    reservations.forEach(reservation => {
        let totalLength = reservation?.vehicle?.length?.max ?? 0;

        if (reservation?.vehicle?.trailer?.exists === true) {
            const trailerLength = reservation?.vehicle?.trailer?.length?.max ?? 0;
            totalLength += trailerLength;
        }

        usedCapacity += totalLength;
    });

    return trip.ferry.ferry_capacity.lower_deck.space - usedCapacity;
};

const calculateMediumDeckCapacity = async (trip: Document & Trip) => {
    if (!trip?.ferry?.ferry_capacity?.medium_deck?.space) {
        return undefined;
    }

    const filteredReservations = await getReservationsByTrip(trip);

    const reservations = filteredReservations.filter(reservation => {
        const vehicleHeight = reservation?.vehicle?.height?.max;
        const min = trip?.ferry?.ferry_capacity?.medium_deck?.min;
        const max = trip?.ferry?.ferry_capacity?.medium_deck?.max;

        if (min !== undefined && max !== undefined && vehicleHeight !== undefined) {
            return vehicleHeight <= max && vehicleHeight > min;
        }
        return false;
    });

    let usedCapacity = 0;
    reservations.forEach(reservation => {
        let totalLength = reservation?.vehicle?.length?.max ?? 0;

        if (reservation?.vehicle?.trailer?.exists === true) {
            const trailerLength = reservation?.vehicle?.trailer?.length?.max ?? 0;
            totalLength += trailerLength;
        }

        usedCapacity += totalLength;
    });

    return trip.ferry.ferry_capacity.medium_deck.space - usedCapacity;
}

const calculateUpperDeckCapacity = async (trip: Document & Trip) => {
    if (!trip?.ferry?.ferry_capacity?.upper_deck?.space) {
        return undefined;
    }

    const filteredReservations = await getReservationsByTrip(trip);

    const reservations = filteredReservations.filter(reservation => {
        const vehicleHeight = reservation?.vehicle?.height?.max;
        const min = trip?.ferry?.ferry_capacity?.upper_deck?.min;
        const max = trip?.ferry?.ferry_capacity?.upper_deck?.max;

        if (min !== undefined && max !== undefined && vehicleHeight !== undefined) {
            return vehicleHeight <= max && vehicleHeight > min;
        }
        return false;
    });

    let usedCapacity = 0;
    reservations.forEach(reservation => {
        let totalLength = reservation?.vehicle?.length?.max ?? 0;

        if (reservation?.vehicle?.trailer?.exists === true) {
            const trailerLength = reservation?.vehicle?.trailer?.length?.max ?? 0;
            totalLength += trailerLength;
        }

        usedCapacity += totalLength;
    });

    return trip.ferry.ferry_capacity.upper_deck.space - usedCapacity;
}

const calculateMotorcycleCapacity = async (trip: Document & Trip) => {
    if (!trip?.ferry?.ferry_capacity?.motorcycle_space) {
        return 0;
    }

    const filteredReservations = await getReservationsByTrip(trip);

    const motorcycleReservations = filteredReservations.filter(reservation =>
        reservation?.vehicle?.motorcycle === true
    );

    const usedCapacity = motorcycleReservations.length;

    return trip.ferry.ferry_capacity.motorcycle_space - usedCapacity;
}