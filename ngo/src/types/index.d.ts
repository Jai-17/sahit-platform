type FormType = "sign-in" | "sign-up";

enum UserRole {
    NGO = "NGO",
    HELP_SEEKER = "HELP_SEEKER",
    ADMIN = "ADMIN",
}

interface SignUpData {
    name: string;
    email: string;
    password: string;
}

interface SignInData {
    email: string;
    password: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole.NGO;
    isOnboarded: boolean;
    helpSeeker?: HelpSeeker;
    accessToken?: string;
    roleId?: string;
}

interface TokenPayload {
    userId: string;
    isOnboarded: boolean;
    isVerified: boolean;
    isAdminApproved: boolean;
    role: string;
    userName?: string;
    email?: string;
    roleId?: string;
}

interface AuthState {
    accessToken: string | null;
    user: TokenPayload | null;
}

interface HelpSeeker {
    address: string;
    age: number;
    alias: string;
    city: string;
    company: string;
    createdAt: DateTime;
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
}

interface HelpRequest {
    attachments: string[];
    description: string;
    helpType: string;
    hideFace: boolean;
    hideId: boolean;
    hideName: boolean;
    id: string;
    ngoId: string;
    status: string;
    submittedAt: DateTime;
    title: string;
    urgency: string;
    user: HelpSeeker;
    userId: string
}