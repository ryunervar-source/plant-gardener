/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 차분한 식물 테마 그린/뉴트럴 팔레트
        leaf: {
          50: '#f2f8f2',
          100: '#e0efe1',
          200: '#c2ddc4',
          300: '#96c29a',
          400: '#63a069',
          500: '#428349',
          600: '#316838',
          700: '#28532e',
          800: '#224227',
          900: '#1d3722',
        },
        sand: {
          50: '#faf9f6',
          100: '#f2f0ea',
          200: '#e6e2d7',
          300: '#d3cdbc',
          400: '#b3ab94',
          500: '#948b71',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Pretendard',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
