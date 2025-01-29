import { NightlyConnectAdapter } from "@nightlylabs/wallet-selector-polkadot";

export interface ConnectionOptions {
  disableModal?: boolean;
  disableEagerConnect?: boolean;
  initOnConnect?: boolean;
}

let _adapter: NightlyConnectAdapter | undefined;
export const getAdapter = async (
  persisted = false,
) => {
  if (_adapter) return _adapter;
  _adapter = await NightlyConnectAdapter.build(
    {
      appMetadata: {
        name: "Vaulted",
        description: "Vaulted",
        icon: "https://docs.nightly.app/img/logo.png",
      },
      network: "Polkadot",
      persistent: persisted,
    },
    {
        disableModal: true,
        disableEagerConnect: false,
        initOnConnect: false,
    }
  );
  return _adapter;
};