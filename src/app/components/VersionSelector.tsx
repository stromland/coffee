import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Version {
  name: string;
  path: string;
}

const VersionSelector = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    // Detect current version from BASE_URL
    const baseUrl = import.meta.env.BASE_URL;
    const versionMatch = baseUrl.match(/\/coffee\/([^/]+)/);
    const detected = versionMatch ? versionMatch[1] : "latest";
    setCurrentVersion(detected);

    // Fetch available versions from the deployment
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await fetch("/coffee/versions.json");
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.warn("Failed to load versions.json:", error);
    }
  };

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
