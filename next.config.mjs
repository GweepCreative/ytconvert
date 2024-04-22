/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: '/googleapi/:path*',
                destination: 'https://rr3---sn-u0g3uxax3-5q5l.googlevideo.com/*',
            },
        ];
    },
    images:{
        domains: ['i.ytimg.com']
    }
};

export default nextConfig;
