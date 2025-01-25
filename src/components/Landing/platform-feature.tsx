function PlatformFeature() {
  return (
    <div className="w-full py-20 lg:py-40 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col-reverse lg:flex-row gap-16 lg:items-center">
          {/* Left side - Visual */}
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-white/20 rounded-xl blur-3xl group-hover:blur-2xl transition-all duration-500" />
            <div className="bg-white/5 backdrop-blur-sm rounded-xl w-full aspect-video relative z-10 shadow-2xl border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_90%)]" />
              {/* Add a lock icon or security visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl animate-pulse">🔒</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="flex gap-8 lg:pl-20 flex-col flex-1">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tighter font-bold text-white">
                How Vaulted Protects Your Data
              </h2>
              <p className="text-xl text-white/80">
                Our comprehensive security solution keeps your data safe and private.
              </p>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  title: "End-to-End Encryption",
                  description: "Only you can access your files",
                  icon: "🔐"
                },
                {
                  title: "Decentralized Network",
                  description: "Your data is distributed and immune to single points of failure",
                  icon: "🌐"
                },
                {
                  title: "Privacy as a Priority",
                  description: "We don't use your data for anything – ever",
                  icon: "🛡️"
                }
              ].map((item, index) => (
                <div key={index} className="group flex gap-6 items-start p-4 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-white transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-lg text-white/70 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PlatformFeature }; 