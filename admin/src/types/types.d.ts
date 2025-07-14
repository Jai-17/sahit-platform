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
    state: string;
    userId: string;
    whatsapp: string;
    whatsappSame: boolean;
    helpStatus?: string;
    user: {isAdminApproved: boolean},
    totalRequests?: number;
    createdAt?: DateTime;
}