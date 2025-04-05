# Wargames Meta2k25

The repository represents the code for the Wargames platform to be used in WLUG Metamorphosis 2k25.

Technologies and Frameworks used:
- [ElectronJS](https://www.electronjs.org/)
- [PhaserJS](https://phaser.io/)
- [Xterm.js](https://xtermjs.org/)
- [React](https://react.dev/)
- [Tailwind](https://tailwindcss.com/)

---


## Demo

https://github.com/user-attachments/assets/a49decdc-16a8-4f84-a363-03996804d19c


---

## Development

Steps to setup development environment:
1. Clone this repo
```
git clone https://github.com/AdityaAparadh/WargamesFrontend
```

2. Install dependencies with your package manager
```
npm install
```
OR
```
bun install
```

3. Start development server:
```
npm run dev
```
OR
```
bun run dev
```

---

## Production Build

Currently, only Linux is supported as a build target.
To generate a production build:

```
npm run build
```
This should generate a binary in `/dist`.

Considerations:
1. Typescript mode is set to `strict`, therefore if your code does not compile in production due to Typescript errors, you can try to remove the typescript step from build script in `package.json`.
2. Builds are not yet supported with `bun`, use `npm` instead. This appears to be an [upstream issue](https://github.com/oven-sh/bun/issues/9895) .

---

## Others

- Set environment variable `WARGAMES_PATH` to the root of this project before execution
