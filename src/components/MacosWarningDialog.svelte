<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		open = false,
		platform,
		onConfirm,
		onCancel
	}: {
		open?: boolean;
		platform: string;
		onConfirm: () => void;
		onCancel: () => void;
	} = $props();
</script>

<svelte:window onkeydown={(event) => open && event.key === 'Escape' && onCancel()} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			class="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
			aria-label={m.macos_warning_close()}
			onclick={onCancel}
		></button>
		<section
			class="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 text-gray-950 shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="macos-warning-title"
			tabindex="-1"
		>
			<div class="flex items-start gap-3">
				<div class="rounded-full bg-amber-100 p-2 text-amber-700">
					<Icon icon="tabler:alert-triangle" class="size-6" />
				</div>
				<div class="min-w-0 flex-1">
					<h2 id="macos-warning-title" class="text-lg font-semibold">
						{m.macos_warning_title()}
					</h2>
					<p class="mt-1 text-sm font-medium text-gray-700">
						{m.macos_warning_download_for({ platform })}
					</p>
				</div>
				<button
					type="button"
					class="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
					aria-label={m.macos_warning_close()}
					onclick={onCancel}
				>
					<Icon icon="tabler:x" class="size-5" />
				</button>
			</div>

			<p class="mt-4 text-sm leading-6 text-gray-700">{m.macos_warning_description()}</p>
			<p class="mt-3 text-sm leading-6 text-gray-700">{m.macos_warning_instruction()}</p>
			<code class="mt-2 block overflow-x-auto rounded-lg bg-gray-950 px-3 py-2 font-mono text-sm text-gray-100">
				/usr/bin/xattr -dr com.apple.quarantine /Applications/OpenAnime.app
			</code>

			<div class="mt-6 flex justify-end gap-2">
				<button
					type="button"
					class="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
					onclick={onCancel}
				>
					{m.macos_warning_cancel()}
				</button>
				<button
					type="button"
					class="rounded-full bg-pink-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-800"
					onclick={onConfirm}
				>
					{m.macos_warning_continue()}
				</button>
			</div>
		</section>
	</div>
{/if}
