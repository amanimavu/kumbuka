import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const KumbukaPreset = definePreset(Aura, {
	//Your customizations, see the following sections for examples
	semantic: {
		primary: {
			50: '{kumbukaPrimary.50}',
			100: '{kumbukaPrimary.100}',
			200: '{kumbukaPrimary.200}',
			300: '{kumbukaPrimary.300}',
			400: '{kumbukaPrimary.400}',
			500: '{kumbukaPrimary.500}',
			600: '{kumbukaPrimary.600}',
			700: '{kumbukaPrimary.700}',
			800: '{kumbukaPrimary.800}',
			900: '{kumbukaPrimary.900}',
			950: '{kumbukaPrimary.950}',
		},
		colorScheme: {
			light: {
				primary: {
					color: '{primary.500}',
					inverseColor: '#ffffff',
					hoverColor: '{primary.400}',
					activeColor: '{primary.300}',
				},
			},
		},
	},
	primitive: {
		kumbukaPrimary: {
			50: '#f1f4f6',
			100: '#d5e1ec',
			200: '#abc1d6',
			300: '#6487a5',
			400: '#274461',
			500: '#122130',
			600: '#0c1620',
			700: '#080e15',
			800: '#04070a',
			900: '#020305',
			950: '#000000',
		},
	},
	components: {
		button: {
			root: {
				lg: {
					paddingX: '2rem',
					paddingY: '1rem',
				},
			},
		},
	},
});
