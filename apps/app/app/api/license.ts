import type { SupabaseClient } from "@supabase/supabase-js";

export interface ActivateLicenseRequest {
	label: string;
	key: string;
}

export interface ActivateLicenseResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export async function activateLicense(
	supabase: SupabaseClient,
	data: ActivateLicenseRequest,
): Promise<ActivateLicenseResponse> {
	try {
		const { data: response, error } =
			await supabase.functions.invoke<ActivateLicenseResponse>(
				"activate-license",
				{
					body: {
						label: data.label,
						key: data.key,
					},
				},
			);

		if (error) {
			return {
				success: false,
				error: error.message || "Failed to activate license",
			};
		}

		return response || { success: false, error: "No response from server" };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "An unexpected error occurred",
		};
	}
}
