import type {
  ProjectGalleryAspect,
  ProjectGalleryItem,
  ProjectGallerySize,
} from "@/types/cms";

export interface GallerySizeOption {
  value: ProjectGallerySize;
  label: string;
  shortLabel: string;
  description: string;
  /** Responsive Tailwind grid column span on a 12-column grid */
  colSpanClass: string;
  /** Default aspect ratio when item.aspect is not explicitly set */
  defaultAspect: ProjectGalleryAspect;
  /** Visual column count out of 12 for Admin Panel live layout preview */
  previewCols: number;
}

export const PROJECT_GALLERY_SIZE_OPTIONS: GallerySizeOption[] = [
  {
    value: "full",
    label: "Full Width (100% Banner)",
    shortLabel: "Full · 100%",
    description: "Spans all 12 columns for hero screens and wide dashboards",
    colSpanClass: "md:col-span-12",
    defaultAspect: "16/9",
    previewCols: 12,
  },
  {
    value: "wide",
    label: "Wide Feature (2/3 Width)",
    shortLabel: "Wide · 66%",
    description: "8 columns — pairs nicely beside a Compact or Tall visual",
    colSpanClass: "md:col-span-8",
    defaultAspect: "16/10",
    previewCols: 8,
  },
  {
    value: "half",
    label: "Half Width (50% Split)",
    shortLabel: "Half · 50%",
    description: "6 columns — balanced two-column side-by-side showcase",
    colSpanClass: "md:col-span-6",
    defaultAspect: "16/10",
    previewCols: 6,
  },
  {
    value: "compact",
    label: "Compact Card (1/3 Width)",
    shortLabel: "Compact · 33%",
    description: "4 columns — ideal for detail callouts or pairing with Wide",
    colSpanClass: "md:col-span-4",
    defaultAspect: "4/3",
    previewCols: 4,
  },
  {
    value: "square",
    label: "Square Tile (1:1 Feature)",
    shortLabel: "Square · 1:1",
    description: "6 columns with a balanced square editorial frame",
    colSpanClass: "md:col-span-6",
    defaultAspect: "1/1",
    previewCols: 6,
  },
  {
    value: "tall",
    label: "Tall Portrait (Mobile / Vertical)",
    shortLabel: "Tall · Mobile",
    description: "4 columns portrait — built for phone screens & vertical layouts",
    colSpanClass: "md:col-span-4",
    defaultAspect: "3/4",
    previewCols: 4,
  },
];

export interface GalleryAspectOption {
  value: ProjectGalleryAspect;
  label: string;
  aspectClass: string;
}

export const PROJECT_GALLERY_ASPECT_OPTIONS: GalleryAspectOption[] = [
  { value: "auto", label: "Auto (Original Size)", aspectClass: "auto" },
  { value: "21/9", label: "Ultrawide (21:9)", aspectClass: "aspect-[21/9]" },
  { value: "16/9", label: "Widescreen (16:9)", aspectClass: "aspect-video" },
  { value: "16/10", label: "Dashboard (16:10)", aspectClass: "aspect-[16/10]" },
  { value: "4/3", label: "Classic (4:3)", aspectClass: "aspect-[4/3]" },
  { value: "1/1", label: "Square (1:1)", aspectClass: "aspect-square" },
  { value: "3/4", label: "Portrait (3:4)", aspectClass: "aspect-[3/4]" },
  { value: "9/16", label: "Mobile Screen (9:16)", aspectClass: "aspect-[9/16]" },
];

export function resolveGallerySizeMeta(size?: ProjectGallerySize): GallerySizeOption {
  return (
    PROJECT_GALLERY_SIZE_OPTIONS.find((opt) => opt.value === size) ||
    PROJECT_GALLERY_SIZE_OPTIONS[2] // default "half"
  );
}

export function resolveGalleryAspectClass(
  aspect?: ProjectGalleryAspect,
  size?: ProjectGallerySize
): string {
  const effectiveAspect = aspect || resolveGallerySizeMeta(size).defaultAspect;
  const found = PROJECT_GALLERY_ASPECT_OPTIONS.find((opt) => opt.value === effectiveAspect);
  return found ? found.aspectClass : "aspect-[16/10]";
}

export function normalizeGalleryItems(gallery?: ProjectGalleryItem[]): ProjectGalleryItem[] {
  if (!Array.isArray(gallery)) return [];
  return gallery.filter((item) => item && typeof item.url === "string" && item.url.trim().length > 0);
}
