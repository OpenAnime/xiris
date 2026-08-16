import { error, type RequestHandler } from '@sveltejs/kit';
import { loadCache } from '$lib/cache';
import type { ErrorResponse } from '$lib/types';
import { downloadAsset } from '$lib/asset';
import { checkAlias } from '$lib/aliases';

export const GET: RequestHandler = async ({ params, url }) => {
	const isUpdate = url.searchParams.get('update') === 'true';

	let platformName = params.platform ?? '';
	if (platformName === 'mac' && !isUpdate) {
		platformName = 'dmg';
	}
	if (platformName === 'mac_arm64' && !isUpdate) {
		platformName = 'dmg_arm64';
	}
	const { latest } = await loadCache();

	const platform = checkAlias(platformName);

	if (!platform) {
		error(400, {
			code: 'platform_invalid',
			message: 'The specified platform is not valid'
		} as ErrorResponse);
	}
	if (!latest?.platforms?.[platform]) {
		error(404, {
			code: 'no_asset',
			message: 'No assets found for this platform'
		} as ErrorResponse);
	}
	return downloadAsset(latest.platforms[platform]);
};
