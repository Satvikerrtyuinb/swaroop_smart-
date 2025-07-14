"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Brain, TrendingDown, ExternalLink, MessageSquare, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RootCauseInsight {
  category: string
  pattern: string
  frequency: number
  impact: string
  recommendation: string
  urgency: "high" | "medium" | "low"
  jiraTicket?: string
  slackChannel?: string
}

export function RootCauseEngine() {
  const [insights, setInsights] = useState<RootCauseInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const generateInsights = async () => {
    setIsAnalyzing(true)

    // Simulate NLP analysis and LLM processing
    setTimeout(() => {
      const mockInsights: RootCauseInsight[] = [
        {
          category: "Footwear",
          pattern: "Size inconsistency across brands",
          frequency: 67,
          impact: "40% of clothing returns, ₹2.3L monthly loss",
          recommendation: "Implement standardized size chart with AR try-on feature",
          urgency: "high",
          jiraTicket: "PROD-1234",
          slackChannel: "#product-team",
        },
        {
          category: "Electronics",
          pattern: "Rapid product lifecycle confusion",
          frequency: 45,
          impact: "Customer satisfaction -15%, unnecessary returns",
          recommendation: "Better product lifecycle communication and upgrade policies",
          urgency: "medium",
          jiraTicket: "PROD-1235",
          slackChannel: "#electronics-team",
        },
        {
          category: "Appliances",
          pattern: "Installation support gaps",
          frequency: 38,
          impact: "30% preventable returns, poor NPS scores",
          recommendation: "Enhanced pre-delivery consultation and professional installation",
          urgency: "medium",
          jiraTicket: "PROD-1236",
          slackChannel: "#services-team",
        },
      ]

      setInsights(mockInsights)
      setIsAnalyzing(false)
      toast({
        title: "Analysis Complete",
        description: "Root cause insights have been generated with actionable recommendations",
      })
    }, 3000)
  }

  const createJiraTicket = (insight: RootCauseInsight) => {
    // Simulate Jira integration
    toast({
      title: "Jira Ticket Created",
      description: `Ticket ${insight.jiraTicket} created for ${insight.category} improvements`,
    })

    // In a real app, this would integrate with Jira API
    setTimeout(() => {
      window.open(`https://smartreturns.atlassian.net/browse/${insight.jiraTicket}`, "_blank")
    }, 1000)
  }

  const openSlackChannel = (insight: RootCauseInsight) => {
    // Simulate Slack integration
    toast({
      title: "Team Notified",
      description: `${insight.slackChannel} team has been notified about the ${insight.category} issue`,
    })

    // In a real app, this would integrate with Slack API
    setTimeout(() => {
      window.open(`https://smartreturns.slack.com/channels/${insight.slackChannel?.replace("#", "")}`, "_blank")
    }, 1000)
  }

  const implementRecommendation = (insight: RootCauseInsight) => {
    toast({
      title: "Implementation Started",
      description: `${insight.recommendation} has been added to the implementation queue`,
    })
  }

  return (
    <Card className="smart-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Root Cause Insight Engine
        </CardTitle>
        <CardDescription>NLP clustering + LLM recommendations for upstream fixes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Button onClick={generateInsights} disabled={isAnalyzing} size="lg" className="smart-button">
              {isAnalyzing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing Return Patterns...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Generate Weekly Insights
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              AI will analyze return reasons and suggest upstream improvements
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Weekly Digest - Return Pattern Analysis</h4>
              <Badge variant="outline">Generated {new Date().toLocaleDateString()}</Badge>
            </div>

            {insights.map((insight, index) => (
              <div key={index} className="border rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold text-gray-800">{insight.category}</h5>
                    <p className="text-sm text-gray-600">{insight.pattern}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        insight.urgency === "high"
                          ? "smart-badge-purple"
                          : insight.urgency === "medium"
                            ? "smart-badge-orange"
                            : "smart-badge-blue"
                      }
                    >
                      {insight.urgency} priority
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{insight.frequency}%</p>
                      <p className="text-xs text-gray-500">frequency</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg text-sm">
                  <div className="flex items-center gap-1 mb-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <strong>Impact:</strong>
                  </div>
                  <p>{insight.impact}</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-sm">
                  <strong>Recommendation:</strong>
                  <p className="mt-1">{insight.recommendation}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => createJiraTicket(insight)} className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Create Jira Ticket
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openSlackChannel(insight)} className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Notify Team
                  </Button>
                  <Button size="sm" className="smart-button flex-1" onClick={() => implementRecommendation(insight)}>
                    <Target className="h-4 w-4 mr-1" />
                    Implement
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full" onClick={generateInsights}>
              <Brain className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
