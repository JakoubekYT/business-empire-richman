import type { ImagePlaceholder } from "../types/game";

interface AssetImageProps {
  image: ImagePlaceholder;
  className?: string;
  size?: number;
}

// Tries to load src/assets/images/{id}.webp
// If not found, renders a styled placeholder with the AI prompt visible
export function AssetImage({ image, className = "", size = 80 }: AssetImageProps) {
  const src = `/assets/images/${image.id}.webp`;

  return (
    <div
      className={`asset-image ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    >
      <img
        src={src}
        alt={image.description || image.id}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const placeholder = target.nextElementSibling as HTMLElement;
          if (placeholder) placeholder.style.display = "flex";
        }}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
      />
      <div
        className="asset-image-placeholder"
        style={{ display: "none", width: "100%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1e293b, #0f172a)", borderRadius: 8, padding: 4, border: "1px dashed rgba(255,255,255,0.15)" }}
      >
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.2, overflow: "hidden", maxHeight: "80%" }}>
          {image.description || image.id}
        </span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.15)", marginTop: 2 }}>AI img needed</span>
      </div>
    </div>
  );
}
