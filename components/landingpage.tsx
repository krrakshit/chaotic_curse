import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Target, ArrowRight, Building2, Calendar, Trophy } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 glass-card text-white border-white/20">
            <Building2 className="w-4 h-4 mr-2" />
            650+ Companies Updated Daily
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            CompCode
            <br />
            Interview Prep
          </h1>

          <p className="text-xl md:text-2xl mb-8 subtle-text max-w-3xl mx-auto leading-relaxed">
            Access the most comprehensive database of real interview questions from top companies. Practice with
            questions filtered by time, difficulty, and company to land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/login">
              <Button size="lg" className="glass-card hover:glass-card text-white border-white/20 px-8 py-4 text-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="glass border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
            >
              View Sample Questions
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm subtle-text">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              650+ Companies
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Updated Daily
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Everything You Need to Succeed</h2>
            <p className="text-xl subtle-text max-w-2xl mx-auto">
              Our platform provides comprehensive interview preparation tools designed by industry experts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card border-white/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 glass rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">650+ Companies</CardTitle>
                <CardDescription className="subtle-text">
                  Questions from FAANG, startups, and everything in between
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="subtle-text">
                  Access interview questions from Google, Apple, Microsoft, Amazon, Meta, and 645+ other top companies.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 glass rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Time-Based Filtering</CardTitle>
                <CardDescription className="subtle-text">Filter by 30 days, 3 months, or 6 months</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="subtle-text">
                  Stay current with the latest interview trends and focus on recently asked questions.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 glass rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Difficulty Levels</CardTitle>
                <CardDescription className="subtle-text">
                  Easy, Medium, and Hard questions for all skill levels
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="subtle-text">
                  Progress from beginner to expert with carefully categorized questions by difficulty.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card border-white/20 p-12 text-center">
            <h3 className="text-3xl font-bold mb-8 gradient-text">Trusted by Thousands</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-white mb-2">650+</div>
                <div className="subtle-text">Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="subtle-text">Questions</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">5K+</div>
                <div className="subtle-text">Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">Daily</div>
                <div className="subtle-text">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card border-white/20 p-12">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Ready to Ace Your Interview?</h2>
            <p className="text-xl subtle-text mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who used our platform to land their dream jobs. Start practicing
              today and get access to 650+ companies interview questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="glass border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                View Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold gradient-text mb-4">CompCode</h3>
            <p className="subtle-text mb-6">
              Your ultimate destination for interview preparation with 650+ companies questions.
            </p>
            <div className="flex justify-center gap-8 text-sm subtle-text">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact Support
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="subtle-text text-sm">
                © 2024 CompCode. All rights reserved. Updated daily with fresh questions.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
