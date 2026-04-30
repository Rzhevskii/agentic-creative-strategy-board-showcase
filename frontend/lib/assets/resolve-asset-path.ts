export function resolveAssetPath(assetPath?: string | null): string | null {
  if (!assetPath) {
    return null;
  }

  if (
    assetPath.startsWith("/") ||
    assetPath.startsWith("http://") ||
    assetPath.startsWith("https://") ||
    assetPath.startsWith("data:") ||
    assetPath.startsWith("blob:")
  ) {
    return assetPath;
  }

  if (assetPath.startsWith("fixtures/") || assetPath.startsWith("docs/assets/")) {
    const encodedPath = assetPath
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");

    return `/api/assets/${encodedPath}`;
  }

  return null;
}
