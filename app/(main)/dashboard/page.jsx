import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
    // First, check if the user has completed onboarding
    const { isOnboarded } = await getUserOnboardingStatus();

    // If not onboarded, redirect to onboarding page
    if (!isOnboarded) {
        redirect("/onboarding");
    }

    try {
        // User is onboarded, get industry insights
        const insights = await getIndustryInsights();

        return (
            <div className="container mx-auto">
                <DashboardView insights={insights}/>
            </div>
        );
    } catch (error) {
        console.error("Error loading dashboard:", error);

        // Show a friendly error message instead of crashing
        return (
            <div className="container mx-auto p-8">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <h2 className="text-2xl font-bold">Unable to load industry insights</h2>
                    <p className="text-muted-foreground max-w-md">
                        We're having trouble loading your industry data. Please try again later or complete your profile if you haven't already.
                    </p>
                    <a href="/onboarding" className="text-primary hover:underline">
                        Go to Profile Setup
                    </a>
                </div>
            </div>
        );
    }
}

export default IndustryInsightsPage