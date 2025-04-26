"use client";

import { Brain, BriefcaseIcon, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import React from 'react'
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashboardView = ({ insights }) => {
    // Handle case where insights is completely null or undefined
    if (!insights) {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <h2 className="text-2xl font-bold">Industry insights unavailable</h2>
          <p className="text-muted-foreground">
            We couldn't load your industry insights at this time. Please try again later.
          </p>
        </div>
      );
    }

    // Add null check for insights and salaryRanges
    const salaryData = insights?.salaryRanges?.map((range) => ({
       name: range.role,
       min: range.min / 1000,
       max: range.max / 1000,
       median: range.median / 1000,
    })) || [];
    const getDemandLevelColor = (level) => {
        if (!level) return "bg-gray-500";

        switch (level.toLowerCase()) {
          case "high":
            return "bg-green-500";
          case "medium":
            return "bg-yellow-500";
          case "low":
            return "bg-red-500";
          default:
            return "bg-gray-500";
        }
    }

    const getMarketOutlookInfo = (outlook) => {
        if (!outlook) return { icon: LineChart, color: "text-gray-500" };

        switch (outlook.toLowerCase()) {
            case "positive":
                return { icon: TrendingUp, color: "text-green-500" };
            case "neutral":
                return { icon: LineChart, color: "text-yellow-500" };
            case "negative":
                return { icon: TrendingDown, color: "text-red-500" };
            default:
                return { icon: LineChart, color: "text-gray-500" };
        }
    }

    // Add null checks and default values
    const OutlookIcon = getMarketOutlookInfo(insights?.marketOutlook).icon;
    const outlookColor = getMarketOutlookInfo(insights?.marketOutlook).color;

    // Safely format dates with fallbacks
    const lastUpdatedDate = insights?.lastUpdated
        ? format(new Date(insights.lastUpdated), "dd/MM/yyyy")
        : "N/A";

    const nextUpdateDistance = insights?.nextUpdate
        ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })
        : "N/A";
  return (
    <div className="space-y-6">
         <div className="flex justify-between items-center">
          <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card>
             <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
                <OutlookIcon className={`h-4 w-4 ${outlookColor}`}/>

             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">{insights?.marketOutlook || 'N/A'}</div>
                 <p className="text-xs text-muted-foreground">
                  Next update: {nextUpdateDistance}
                 </p>
             </CardContent>

          </Card>


          <Card>
             <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />

             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">
                {insights?.growthRate ? `${insights.growthRate.toFixed(1)}%` : 'N/A'}
                </div>
                <Progress value={insights?.growthRate || 0} className="mt-2" />

             </CardContent>

          </Card>


          <Card>
             <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />

             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">{insights?.demandLevel || 'N/A'}</div>
                 <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights?.demandLevel)}`}></div>


             </CardContent>

          </Card>


          <Card>
             <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />

             </CardHeader>
             <CardContent>
                <div className="flex flex-wrap gap-1 text-2xl">
                {insights?.topSkills?.length > 0 ? (
                  insights.topSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No skills data available</span>
                )}
                </div>

             </CardContent>

          </Card>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <Card>
             <CardHeader >
                <CardTitle>Salary Ranges by Role</CardTitle>
                <CardDescription>
                  Displaying minimum, median, and maximum salaries (in thousands)
                </CardDescription>

             </CardHeader>
             <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={salaryData}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis dataKey="name" />
                           <YAxis />
                          <Tooltip
                               content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                       <div className="bg-background border rounded-lg p-2 shadow-md">
                                           <p className="font-medium">{label}</p>
                                               {payload.map((item) => (
                                            <p key={item.name} className="text-sm">
                                                {item.name}: ${item.value}K
                                           </p>
                                         ))}
                                       </div>
                                      );
                                    }
                                return null;
                                }}
                              />
                             <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                            <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                             <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
                            </BarChart>
                            </ResponsiveContainer>
                      </div>

             </CardContent>

          </Card>

          <div className="grid grid-cols-1 mt-6 mb-8 md:grid-cols-2 gap-4">
             <Card>
                <CardHeader>
                  <CardTitle>Key Industry Trends</CardTitle>
                  <CardDescription>
                        Current trends shaping the industry
                  </CardDescription>
                </CardHeader>
               <CardContent>
               <ul className="space-y-4">
                     {insights?.keyTrends?.length > 0 ? (
                       insights.keyTrends.map((trend, index) => (
                         <li key={index} className="flex items-start space-x-2">
                           <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                           <span>{trend}</span>
                         </li>
                       ))
                     ) : (
                       <li className="text-muted-foreground text-sm">No trend data available</li>
                     )}
                </ul>

               </CardContent>
             </Card>

             <Card>
                <CardHeader>
                  <CardTitle>Recommended Skills</CardTitle>
                  <CardDescription>
                        Skills to consider developing
                  </CardDescription>
                </CardHeader>
               <CardContent>
               <div className="flex flex-wrap gap-2">
                       {insights?.recommendedSkills?.length > 0 ? (
                         insights.recommendedSkills.map((skill) => (
                           <Badge key={skill} variant="outline">
                             {skill}
                           </Badge>
                         ))
                       ) : (
                         <span className="text-muted-foreground text-sm">No recommended skills available</span>
                       )}
                </div>

               </CardContent>
             </Card>
          </div>


          </div>

    </div>
  )
}

export default DashboardView