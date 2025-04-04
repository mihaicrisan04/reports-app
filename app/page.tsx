import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/top-nav";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Create Beautiful Reports in Minutes
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Our intuitive platform helps you generate professional reports quickly and easily. No more struggling with complex tools.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Everything you need to create professional reports
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-background">
                <div className="p-2 bg-primary/10 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Users Say
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Don't just take our word for it
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col space-y-2 rounded-lg border p-6 bg-background">
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Join thousands of users who are already creating beautiful reports
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/sign-up">
                  Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2023 Reports App. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Easy to Use",
    description: "Intuitive interface that anyone can use without training",
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
  },
  {
    title: "Customizable Templates",
    description: "Choose from a variety of professional templates",
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
  },
  {
    title: "Export Anywhere",
    description: "Export your reports in multiple formats for any need",
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
  },
];

const testimonials = [
  {
    quote: "This app has completely transformed how I create reports. It's so much faster and easier!",
    name: "Sarah Johnson",
    title: "Marketing Director",
  },
  {
    quote: "The templates are beautiful and professional. My clients are impressed with every report.",
    name: "Michael Chen",
    title: "Business Consultant",
  },
  {
    quote: "I've tried many report tools, but this one is by far the best. Highly recommended!",
    name: "Emily Rodriguez",
    title: "Project Manager",
  },
];
