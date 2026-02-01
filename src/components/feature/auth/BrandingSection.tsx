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
    <div className="hidden lg:flex flex-col justify-center space-y-6">
      <div className="space-y-5">
        <div>
          <Image
            src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
            alt="Eco Market"
            width={120}
            height={120}
            className="h-20 w-auto"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl xl:text-4xl font-bold text-foreground leading-tight">
            {title}{" "}
            <span className="text-primary">{titleHighlight}</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-base max-w-md leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg ${feature.gradient} flex items-center justify-center text-white`}
            >
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
