import { WellKnownChain } from '@substrate/connect';
import CereIcon from '../assets/cere_icon.svg?react'
import CereLogo from '../assets/cere_logo.svg?react'

export type Fn = () => void;

export enum NetworkName {
  Polkadot = 'polkadot',
  Kusama = 'kusama',
  Westend = 'westend',
}

export interface Networks {
  [key: string]: Network;
}

export interface Network {
  name: string;
  endpoints: {
    rpc: string;
    lightClient: WellKnownChain;
  };
  colors: {
    primary: {
      light: string;
      dark: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
    stroke: {
      light: string;
      dark: string;
    };
    transparent: {
      light: string;
      dark: string;
    };
  };
  subscanEndpoint: string;
  cereStatsEndpoint: string;
  unit: string;
  units: number;
  ss58: number;
  brand: {
    icon: typeof CereIcon;
    logo: {
      svg: typeof CereLogo;
      width: string;
    };
    inline: {
      svg: typeof CereIcon;
      size: string;
    };
  };
  api: {
    unit: string;
    priceTicker: string;
  };
  params: { [key: string]: number };
}

export const DefaultParams = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  stakeTarget: 0.2,
  maxInflation: 0.05,
  minInflation: 0.0001,
};

const cereMainnet = {
  name: 'Cere',
  colors: {
    primary: {
      light: '#1D1B20',
      dark: 'rgb(183, 174, 255)',
    },
    secondary: {
      light: '#Ec8f6e',
      dark: '#Ec8f6e',
    },
    stroke: {
      light: 'rgb(236, 110, 121)',
      dark: 'rgb(183, 174, 255)',
    },
    transparent: {
      light: 'rgb(236,110,121,0.05)',
      dark: 'rgb(236,110,121, 0.05)',
    },
  },
  endpoints: {
    rpc: 'wss://archive.mainnet.cere.network/ws',
    lightClient: WellKnownChain.polkadot,
  },
  subscanEndpoint: '',
  cereStatsEndpoint: 'wss://hasura.stats.cere.network/v1/graphql',
  unit: 'CERE',
  units: 10,
  ss58: 54,
  brand: {
    icon: CereIcon,
    logo: {
      svg: CereLogo,
      width: '8.5rem',
    },
    inline: {
      svg: CereIcon,
      size: '1.15rem',
    },
  },
  api: {
    unit: 'CERE',
    priceTicker: 'CEREUSDT',
  },
  features: {
    pools: false,
  },
  params: DefaultParams,
};

const cereTestnet = {
  ...cereMainnet,
  name: 'Cere Testnet',
  endpoints: {
    rpc: 'wss://archive.testnet.cere.network/ws',
    lightClient: WellKnownChain.polkadot,
  },
  cereStatsEndpoint: 'wss://stats-hasura.network-dev.aws.cere.io/v1/graphql',
};

const cereDevnet = {
  ...cereMainnet,
  name: 'Cere Devnet',
  endpoints: {
    rpc: 'wss://archive.devnet.cere.network/ws',
    lightClient: WellKnownChain.polkadot,
  },
  cereStatsEndpoint: 'wss://stats-hasura.network-dev.aws.cere.io/v1/graphql',
};

const cereQAnet = {
  ...cereMainnet,
  name: 'Cere Qanet',
  endpoints: {
    rpc: 'wss://archive.qanet.cere.network/ws',
    lightClient: WellKnownChain.polkadot,
  },
  cereStatsEndpoint: 'wss://stats-hasura.network-dev.aws.cere.io/v1/graphql',
};

// Determine if the testnet should be included based on the REACT_APP_INCLUDE_TESTNET environment variable
// By default, includeTestnet is true or undefined unless REACT_APP_INCLUDE_TESTNET is explicitly set to 'false'
const includeTestnet = import.meta.env.REACT_APP_INCLUDE_TESTNET !== 'false';

/*
 * Network Configuration
 */
export const NETWORKS: Networks = {
  cereMainnet,
  ...(includeTestnet ? { cereTestnet } : {}),
  cereDevnet,
  cereQAnet,
};