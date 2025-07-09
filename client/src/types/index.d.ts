type FormType = "sign-in" | "sign-up";

enum UserRole {
    NGO = "NGO",
    HELP_SEEKER = "HELP_SEEKER",
    ADMIN = "ADMIN",
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
