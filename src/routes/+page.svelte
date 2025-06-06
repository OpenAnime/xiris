<script lang="ts">
	import { aliases, checkAlias } from '$lib/aliases';
	import type { PageProps } from './$types';
	import Icon from '@iconify/svelte';
	import Button from '$components/Button.svelte';
	import anime from 'animejs';
	import Select from '$components/Select.svelte';
	import Tag from '$components/Tag.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';

	let { data }: PageProps = $props();

	let available = $state(false);
	// if data.cache.latest.platforms exists for the user's os
	const alias = checkAlias(`${data.os?.name}`.toLowerCase()) ?? null;
	if (alias) {
		if (data.cache.latest.platforms[alias]) {
			available = true;
		}
	}

	let selectedPlatform = $state('');
	const downloadablePlatforms = data.cache.latest?.platforms
		? Object.keys(data.cache.latest.platforms)
		: [];
	let dropdownItems = $state([]);
	downloadablePlatforms.forEach((platform) => {
		const item = {
			value: aliases[platform][1],
			label: aliases[platform][0]
		};
		dropdownItems.push(item);
	});
	console.log(page.data)
	onMount(() => {
		anime({
			targets: '.animate',
			duration: 1000,
			translateY: [-20, 0],
			opacity: [0, 1],
			delay: anime.stagger(100),
			easing: 'easeOutExpo'
		});
		anime;
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
					<Button href="/download" class="!pr-4" type="accent" rounded data-no-translate
						>{m.download_for({ platform: data.os.name })}<Icon
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
					href="/download/{selectedPlatform}"
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
	<div class="flex items-center justify-center overflow-clip animate">
		<div>
			<img
				src="/app-light.png"
				class="rounded-xl shadow-2xl translate-x-40 hover:translate-x-10 transition-transform duration-500 ease-in-out select-none"
			/>
		</div>
	</div>
</div>
