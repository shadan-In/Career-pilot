import { getResume } from "@/actions/resume"
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import ResumeBuilder from "./_components/resume-builder"

const ResumePage = async () => {
  // Check if user has completed onboarding
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // User is onboarded, get resume data
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6">
        <ResumeBuilder initialContent={resume?.content}/>
    </div>
  )
}

export default ResumePage