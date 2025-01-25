import { cn } from "@/lib/utils";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Total Privacy, Guaranteed",
      description:
        "Your files are fully encrypted and only accessible by you.",
      icon: "🔒",
    },
    {
      title: "Built on Decentralization", 
      description:
        "Your data is distributed across a global network for maximum security.",
      icon: "🌐",
    },
    {
      title: "Zero Trust, Full Control",
      description:
        "We never access or analyze your data. Period.",
      icon: "🛡️",
    },
    {
      title: "Ready for the AI Era",
      description:
        "Seamlessly integrate with AI tools while keeping data secure.",
      icon: "🤖",
    },
    {
      title: "Scales Effortlessly with You",
      description:
        "From solo to enterprise, we grow with your needs.",
      icon: "📈",
    },
    {
      title: "Collaboration Without Compromise",
      description:
        "Share and work together securely with built-in team tools.",
      icon: "👥",
    },
    {
      title: "Always On, Always There",
      description:
        "100% uptime guaranteed. Your files are always accessible.",
      icon: "⚡",
    },
    {
      title: "So Simple, It Just Works",
      description:
        "User-friendly interface that anyone can use.",
      icon: "🚀",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-white/10",
        "transition-all duration-500 ease-out hover:bg-white/5",
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-500 absolute inset-0 h-full w-full bg-[radial-gradient(circle_400px_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-500 absolute inset-0 h-full w-full bg-[radial-gradient(circle_400px_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
      )}
      <div className="mb-4 relative z-10 px-10 text-white/80">
        <div className="text-4xl transform group-hover/feature:scale-110 transition-transform duration-500">
          {icon}
        </div>
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10 overflow-hidden">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/20 transition-all duration-500 origin-center group-hover/feature:animate-pulse" />
        <span className="group-hover/feature:translate-x-2 transition duration-500 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-white/70 max-w-xs relative z-10 px-10 transition-colors duration-500 group-hover/feature:text-white/90">
        {description}
      </p>
    </div>
  );
};
