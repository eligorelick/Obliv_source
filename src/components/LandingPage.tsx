import React from 'react';
import { Shield, Lock, Laptop, Globe, Code, Zap, ArrowRight, Brain, Server, Eye } from 'lucide-react';

interface LandingPageProps {
  onStartChat: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const features = [
    {
      icon: Lock,
      title: '100% Private',
      description: 'Everything runs locally in your browser'
    },
    {
      icon: Eye,
      title: 'No Data Collection',
      description: "We can't see your chats even if we wanted to"
    },
    {
      icon: Laptop,
      title: 'No Account Needed',
      description: 'Just open and chat'
    },
    {
      icon: Globe,
      title: 'Works Offline',
      description: 'After initial model download'
    },
    {
      icon: Code,
      title: 'Open Source',
      description: 'Verify our privacy claims yourself'
    },
    {
      icon: Zap,
      title: 'Three Model Sizes',
      description: 'From lightweight to powerful'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Choose Your Model',
      description: 'Select a model based on your device capabilities'
    },
    {
      number: '2',
      title: 'Download Once',
      description: 'Model downloads and caches in your browser'
    },
    {
      number: '3',
      title: 'Chat Privately',
      description: 'All processing happens on your device'
    },
    {
      number: '4',
      title: 'Stay Secure',
      description: 'Your data never touches any server'
    }
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl" aria-hidden="true">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-accent opacity-20" />
          </div>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <Brain className="h-20 w-20 text-primary" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            True AI Privacy
            <span className="block text-gradient mt-2">No Servers, No Tracking, No Compromise</span>
          </h1>

          <p className="mt-6 text-xl leading-8 text-gray-300 max-w-3xl mx-auto">
            Chat with AI models running entirely in your browser. Your conversations never leave your device.
          </p>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={onStartChat}
              className="glass gradient-primary px-8 py-4 text-lg font-semibold text-white rounded-xl glass-hover flex items-center gap-2 transform transition hover:scale-105"
            >
              Start Private Chat
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>No Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 line-through" />
              <span>No Server Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>End-to-End Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Privacy Without Compromise
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Experience the future of private AI conversations
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass rounded-2xl p-8 transform transition hover:scale-105"
                >
                  <div className="mb-4">
                    <Icon className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 lg:px-8 bg-dark-lighter">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Simple, secure, and completely private
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass rounded-3xl p-12 text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Privacy Guarantee
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              OBLIVAI is designed from the ground up with privacy as the core principle.
              No user data, conversations, or personal information ever leaves your device.
              This isn't just a promise - it's architecturally impossible for us to access your data.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onStartChat}
                className="gradient-primary px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition"
              >
                Try It Now
              </button>
              <a
                href="https://github.com/oblivai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass px-6 py-3 rounded-xl text-white font-semibold glass-hover transition"
              >
                View Source Code
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};