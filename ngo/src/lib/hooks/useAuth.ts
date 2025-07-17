import { RootState } from "@/store/store"
import { useSelector } from "react-redux"


export const useAuth = () => {
    const {accessToken, user} = useSelector((state: RootState) => state.auth);

    return {
        accessToken,
        userId: user?.userId,
        isOnboarded: user?.isOnboarded,
        isVerified: user?.isVerified,
        isAdminApproved: user?.isAdminApproved,
        role: user?.role,
    }
}