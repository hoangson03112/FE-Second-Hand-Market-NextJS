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
    <div className="hidden lg:flex flex-col justify-center space-y-12 pr-8">
      <div className="space-y-8">
        <div>
          <Image
            src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
            alt="Eco Market"
            width={140}
            height={140}
            className="h-24 w-auto"
            priority
          />
        </div>
        <div>
          <h1 className="text-[3rem] xl:text-[3.75rem] font-bold text-taupe-900 leading-[1.1] mb-6">
            {title}{" "}
            <span className="text-primary">{titleHighlight}</span>
          </h1>
          <p className="text-taupe-600 text-[17px] max-w-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-5 bg-white/50 backdrop-blur-md rounded-2xl border border-gray-100 hover:border-primary/40 hover:bg-white/70 hover:shadow-lg transition-all duration-300 group"
          >
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              {feature.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-taupe-900 text-[15px] mb-1">{feature.title}</h3>
              <p className="text-[14px] text-taupe-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
