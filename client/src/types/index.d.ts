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
    role: UserRole.HELP_SEEKER;
    isOnboarded: boolean;
    helpSeeker?: HelpSeeker;
}

interface HelpSeeker {
    id: string;
}
