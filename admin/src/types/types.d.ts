interface Women {
    address: string;
    age: number;
    alias: string;
    city: string;
    company: string;
    contact: string;
    email: string;
    id: string;
    idProofs: string;
    jobType: string;
    name: string;
    occupation: string;
    photo: string;
    _count: {
        helpRequests: number;
    }
    state: string;
    userId: string;
    whatsapp: string;
    whatsappSame: boolean;
    helpStatus?: string;
    user: {isAdminApproved: boolean},
    totalRequests?: number;
    createdAt?: DateTime;
    helpRequests: HelpRequest[];
}

interface NGO {
    id: string;
    name: string;
    supportTypes: string[];
    address: string;
    city: string;
    state: string;
    rating: number;
    createdAt: DateTime;
    email: string;
    whatsappSame: boolean;
    resolvedHelpRequestCount: number;
    phone: string;
    whatsappNumber: string;
    about: string;
    representativeName: string;
    representativeTitle: string;
    representativeAvailability: string;
    verifiedDocs: string[];
    userId: string;
    user: {isAdminApproved: boolean};
    totalHelped?: number;
}