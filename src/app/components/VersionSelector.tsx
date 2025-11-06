import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Version {
  name: string;
  path: string;
  directory: string;
}

const VersionSelector = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const location = useLocation();

  const fetchVersions = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL;
      const versionsUrl = baseUrl.endsWith("local")
        ? `${baseUrl}/local-versions.json`
        : "/coffee/versions.json";
      const response = await fetch(versionsUrl);
      if (response.ok) {
        const data = await response.json();
        const loadedVersions = data.versions || [];
        setVersions(loadedVersions);

        // Detect current version from BASE_URL after loading versions
        const versionMatch = baseUrl.match(/\/coffee\/([^/]+)/);
        const detectedDir = versionMatch ? versionMatch[1] : "latest";

        // Find the matching version by directory name
        const current = loadedVersions.find((v: Version) => v.directory === detectedDir);
        if (current) {
          setCurrentVersion(current.name);
        }
      }
    } catch (error) {
      console.warn("Failed to load versions.json:", error);
    }
  }, []);

  useEffect(() => {
    // Fetch available versions from the deployment
    fetchVersions();
  }, [fetchVersions]);

  const handleVersionChange = (versionPath: string) => {
    // Preserve current route when switching versions
    const currentRoute = location.pathname.replace(import.meta.env.BASE_URL, "/");
    const newUrl = `${versionPath}${currentRoute === "/" ? "" : currentRoute}`;
    window.location.href = newUrl;
  };

  return (
    <div className="relative">
      <select
        value={currentVersion}
        onChange={(e) => {
          const selected = versions.find((v) => v.name === e.target.value);
          if (selected) {
            handleVersionChange(selected.path);
          }
        }}
        className="px-3 py-2 rounded-lg bg-olive/20 text-caramel hover:text-cream hover:bg-olive/30 transition-all font-medium text-sm border border-olive/30 focus:outline-none focus:ring-2 focus:ring-coffee/50 cursor-pointer"
        aria-label="Select version"
      >
        {versions.map((version) => (
          <option key={version.name} value={version.name}>
            {version.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VersionSelector;
