/// <reference types="vite/client" />

declare module '*.svg' {
  import React from 'react'
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVGComponent
}

declare module '*.svg?react' {
  import React from 'react'
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVGComponent
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly REACT_APP_INCLUDE_TESTNET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
