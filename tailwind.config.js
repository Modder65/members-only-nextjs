/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      textColor: {
        skin: {
          base: 'var(--color-text-base)',
          muted: 'var(--color-text-muted)',
          inverted: 'var(--color-text-inverted)',
          onbackground: 'var(--color-text-onbackground)',
          fill: 'var(--color-fill)',
          header: 'var(--color-text-header)',
          'link-accent': 'var(--color-link-accent)',
          'link-accent-hover': 'var(--color-link-accent-hover)',
          'icon-accent': 'var(--color-icon-accent)',
          'icon-accent-hover': 'var(--color-icon-accent-hover)',
        }
      },
      backgroundColor: {
        skin: {
          fill: 'var(--color-fill)',
          'button-accent': 'var(--color-button-accent)',
          'button-accent-unselected': 'var(--color-button-accent-unselected)',
          'button-onbackground-accent': 'var(--color-button-onbackground-accent)',
          'button-accent-hover': 'var(--color-button-accent-hover)',
          'dropdownitem-accent-hover': 'var(--color-dropdownitem-accent-hover)',
          'icon-accent': 'var(--color-icon-accent)',
          'icon-accent-hover': 'var(--color-icon-accent-hover)',
          'switch-checked': 'var(--color-switch-checked)',
        }
      },
      backgroundImage: {
        image: 'var(--background-image)',
      },
      backgroundSize: {
        size: 'var(--background-size)',
      },
      borderColor: {
        skin: {
          fill: 'var(--color-border)',
        }
      },
      gradientColorStops: {
        skin: {
          hue: 'var(--color-fill)'
        }
      },

      colors: {
        bluetheme: "var(--custom-blue)",
        greentheme: "var(--custom-green)",
        redtheme: "var(--custom-red)",
        yellowtheme: "var(--custom-yellow)",
        purpletheme: "var(--custom-purple)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}