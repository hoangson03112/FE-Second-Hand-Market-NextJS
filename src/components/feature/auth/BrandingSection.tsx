import React from "react";
import Image from "next/image";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

interface BrandingSectionProps {
  title: string;
  titleHighlight: string;
  description: string;
  features: Feature[];
}

export default function BrandingSection({
  title,
  titleHighlight,
  description,
  features,
}: BrandingSectionProps) {
  return (
    <div className="hidden lg:block space-y-8 text-center lg:text-left">
      <div className="space-y-6">
        <div className="inline-block">
          <Image
            src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
            alt="Eco Market Logo"
            width={180}
            height={180}
            className="h-28 w-auto drop-shadow-2xl"
            priority
          />
        </div>
        <div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            {title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              {titleHighlight}
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center shadow-lg`}>
              {feature.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

