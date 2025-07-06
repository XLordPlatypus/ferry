import {routeService} from "./routeSchema";

export const generateFakeRoute = (fromDestination: String, toDestination: String, subtitle: string) => {
    return new routeService({
        from_destination: fromDestination,
        to_destination: toDestination,
        subtitle: subtitle,
    })
}

