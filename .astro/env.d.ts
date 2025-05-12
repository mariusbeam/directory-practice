declare module 'astro:env/client' {
	export const POSTHOG_API_KEY: string | undefined;	
	export const POSTHOG_API_HOST: string | undefined;	
}declare module 'astro:env/server' {
	export const NOTION_TOKEN: string | undefined;	
}