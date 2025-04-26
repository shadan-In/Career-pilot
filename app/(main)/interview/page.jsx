import { getAssessments } from "@/actions/interview";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  // Check if user has completed onboarding
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // User is onboarded, get assessments
  const assessments = await getAssessments();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}