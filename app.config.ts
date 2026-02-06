import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'Nofilter Clinic',
    slug: 'nofilter-clinic',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'nofilterclinic',
    userInterfaceStyle: 'automatic',

    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#0d525a',
    },

    assetBundlePatterns: ['**/*'],

    ios: {
        supportsTablet: true,
        bundleIdentifier: 'clinic.nofilter.app',
        infoPlist: {
            ITSAppUsesNonExemptEncryption: false,
        },
    },

    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#0d525a',
        },
        package: 'clinic.nofilter.app',
    },

    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/favicon.png',
    },

    plugins: [
        'expo-router',
        [
            'expo-splash-screen',
            {
                image: './assets/splash.png',
                resizeMode: 'contain',
                backgroundColor: '#0d525a',
            },
        ],
        [
            'expo-build-properties',
            {
                android: {
                    usesCleartextTraffic: true,
                },
            },
        ],
    ],

    experiments: {
        typedRoutes: true,
    },

    updates: {
        url: 'https://u.expo.dev/605bacad-5678-4941-a11c-9ff5ab5df9b4',
    },

    // Bare/prebuilt workflow requires a fixed string runtimeVersion (no policy object).
    runtimeVersion: '1.0.0',

    extra: {
        router: {
            origin: false,
        },
        apiBaseUrl:
            process.env.EXPO_PUBLIC_API_BASE_URL || 'https://nofilter.clinic/api/v1',
        eas: {
            projectId: '94cc4579-8473-4428-8c39-3e9f8ab5751b',
        },
    },
});
