<script lang="ts">
	import { checkAlias, getPlatformLabel, isLinuxInstaller, isMacOSPlatform } from '$lib/aliases';
	import type { PageProps } from './$types';
	import Icon from '@iconify/svelte';
	import Button from '$components/Button.svelte';
	import anime from 'animejs';
	import Select from '$components/Select.svelte';
	import Tag from '$components/Tag.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import MacosWarningDialog from '$components/MacosWarningDialog.svelte';

	let { data }: PageProps = $props();

	type DownloadOption = { value: string; label: string };

	const downloadablePlatforms = Object.keys(data.cache.latest?.platforms ?? {});
	const isLinux = data.os?.name?.toLowerCase() === 'linux';
	const detectedPlatform = checkAlias(data.os?.name);
	const detectedDownloadPlatform = detectedPlatform === 'darwin' ? 'dmg' : detectedPlatform;
	const detectedPlatformLabel =
		typeof detectedDownloadPlatform === 'string'
			? getPlatformLabel(detectedDownloadPlatform)
			: data.os?.name || '';
	const hasDetectedDownload =
		typeof detectedDownloadPlatform === 'string' &&
		Boolean(data.cache.latest?.platforms?.[detectedDownloadPlatform]);
	const selectablePlatforms = isLinux
		? downloadablePlatforms.filter(isLinuxInstaller)
		: downloadablePlatforms;
	const dropdownItems: DownloadOption[] = selectablePlatforms.map((platform) => ({
		value: platform,
		label: getPlatformLabel(platform)
	}));

	let available = $state(!isLinux && hasDetectedDownload);
	let selectedPlatform = $state(dropdownItems.length === 1 ? dropdownItems[0].value : '');
	let warningOpen = $state(false);
	let pendingDownload = $state('');
	let pendingDownloadHref = $state('');
	const macosWarningEnabled = !['false', '0', 'off', 'no'].includes(
		(env.PUBLIC_MACOS_UNSIGNED_WARNING || 'true').toLowerCase()
	);

	function requestDownload(platform: string, href: string) {
		if (macosWarningEnabled && isMacOSPlatform(platform)) {
			pendingDownload = platform;
			pendingDownloadHref = href;
			warningOpen = true;
			return;
		}

		void goto(href);
	}

	function cancelDownload() {
		warningOpen = false;
		pendingDownload = '';
		pendingDownloadHref = '';
	}

	function confirmDownload() {
		const href = pendingDownloadHref;
		cancelDownload();
		if (href) void goto(href);
	}
	onMount(() => {
		anime({
			targets: '.animate',
			duration: 1000,
			translateY: [-20, 0],
			opacity: [0, 1],
			delay: anime.stagger(100),
			easing: 'easeOutExpo'
		});
	});
</script>

<div class="flex flex-1 relative">
	<div class="flex flex-col w-3/4 justify-center gap-4 p-[10vw]">
		<div
			class="w-16 h-16 p-3 rounded-xl border-1 border-gray-400 aspect-square bg-linear-120 from-white/10 overflow-hidden animate"
		>
			<img src="/favicon512.png" alt="Logo" />
		</div>
		<h1 class="font-semibold text-5xl animate">{m.app_name()}</h1>
		<span class="text-sm text-gray-900 animate">{m.landing_desc()}</span>
		<div class="flex gap-2 w-full animate">
			{#if available}
				<div class="flex flex-col gap-2">
					<Button
						onclick={() => requestDownload('dmg', '/download')}
						class="!pr-4"
						type="accent"
						rounded
						data-no-translate
						>{m.download_for({ platform: detectedPlatformLabel })}<Icon
							icon="tabler:arrow-narrow-right"
							class="ml-2 size-6"
						/></Button
					>
					<a class="text-sm focusable select-none" href="#" onclick={() => (available = false)}
						>{m.select_another_platform()}</a
					>
				</div>
			{:else}
				<Select
					bind:value={selectedPlatform}
					placeholder={m.select_platform()}
					items={dropdownItems}
				/>
				<Button
					class="!pr-4"
					onclick={() =>
						selectedPlatform && requestDownload(selectedPlatform, `/download/${selectedPlatform}`)}
					disabled={!selectedPlatform}
					data-no-translate
					type="accent"
					rounded
					>{m.download()} <Icon icon="tabler:arrow-narrow-right" class="ml-2 size-6" /></Button
				>
			{/if}
		</div>
		<hr class="animate" />
		<div class="flex items-center justify-between">
			<span
				class="bg-linear-65 from-purple-900 to-blue-900 text-sm font-bold text-transparent bg-clip-text animate"
			>
				{data.cache.latest.version}
			</span>
			{#if data.cache.latest.prerelease}
				<Tag class="bg-amber-200 text-amber-900 animate">{m.prerelease()}</Tag>
			{/if}
		</div>
	</div>
	<MacosWarningDialog
		open={warningOpen}
		platform={getPlatformLabel(pendingDownload || 'dmg')}
		onConfirm={confirmDownload}
		onCancel={cancelDownload}
	/>
	<div class="flex items-center justify-center overflow-clip animate">
		<div>
			<img
				src="/app-light.png"
				class="rounded-xl shadow-2xl translate-x-40 hover:translate-x-10 transition-transform duration-500 ease-in-out select-none"
			/>
		</div>
	</div>
</div>
