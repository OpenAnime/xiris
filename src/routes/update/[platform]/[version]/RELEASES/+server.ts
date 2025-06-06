import { json, text } from '@sveltejs/kit';
import { loadCache } from '$lib/cache';
export async function GET() {
	const cache = await loadCache();
	console.log(cache)

	return text(cache.latest.files.RELEASES, {
		headers: {
			'Cache-Control': 'public, max-age=60'
		}
	});
}
