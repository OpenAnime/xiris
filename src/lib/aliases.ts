export const aliases = {
	darwin: ['macOS', 'macos', 'mac', 'osx'],
	exe: ['Windows', 'windows', 'win32', 'win'],
	deb: ['Debian (.deb)', 'debian'],
	rpm: ['RPM (.rpm)', 'fedora'],
	AppImage: ['AppImage', 'appimage'],
	dmg: ['dmg']
} as Record<string, string[]>;

const linuxInstallers = new Set(['deb', 'rpm', 'AppImage']);
const directInstallers = new Set(['exe', 'dmg', 'rpm', 'deb']);
const macosInstallers = new Set(['darwin', 'dmg']);

function splitArchitecture(platform: string) {
	return platform.endsWith('_arm64')
		? { base: platform.slice(0, -'_arm64'.length), architecture: '_arm64' }
		: { base: platform, architecture: '' };
}

export function checkAlias(platform: string | undefined) {
	if (!platform) return false;

	const normalizedPlatform = platform.trim().toLowerCase();
	const directMatch = Object.keys(aliases).find(
		(canonical) => canonical.toLowerCase() === normalizedPlatform
	);
	const aliasMatch = Object.entries(aliases).find(([, aliasList]) =>
		aliasList.some((alias) => alias.toLowerCase() === normalizedPlatform)
	);
	const canonical = directMatch ?? aliasMatch?.[0];
	if (canonical) return canonical;

	const architectureMatch = normalizedPlatform.match(/^(.*)_arm64$/);
	if (!architectureMatch) return false;

	const basePlatform = checkAlias(architectureMatch[1]);
	return basePlatform ? `${basePlatform}_arm64` : false;
}

export function getPlatformLabel(platform: string) {
	const { base, architecture } = splitArchitecture(platform);
	if (macosInstallers.has(base)) return architecture ? 'macOS (ARM)' : 'macOS (Intel)';

	const label = aliases[base]?.[0] ?? base;
	return architecture ? `${label} (ARM64)` : label;
}

export function getDownloadPlatform(platform: string | false) {
	if (!platform) return false;

	const { base, architecture } = splitArchitecture(platform);
	return base === 'darwin' ? `dmg${architecture}` : platform;
}

export function isMacOSPlatform(platform: string | false) {
	return typeof platform === 'string' && macosInstallers.has(splitArchitecture(platform).base);
}

export function isLinuxInstaller(platform: string) {
	return linuxInstallers.has(splitArchitecture(platform).base);
}

export function checkPlatform(fileName: string) {
	const normalizedFileName = fileName.toLowerCase();
	const extension = normalizedFileName.split('.').pop() || '';
	const arch = /(?:arm64|aarch64)/.test(normalizedFileName) ? '_arm64' : '';

	if (
		(normalizedFileName.includes('mac') || normalizedFileName.includes('darwin')) &&
		extension === 'zip'
	) {
		return 'darwin' + arch;
	}

	if (extension === 'appimage') return `AppImage${arch}`;

	return directInstallers.has(extension) ? extension + arch : false;
}
