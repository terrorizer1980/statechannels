import {StateNodeConfig} from 'xstate';
type TContext = any;
import {MetamaskAction} from './actions';
export interface MetamaskState {
  network?: number;
  accounts: string[];
  loading: boolean;
}

// metamask machine
interface MMStateSchema {
  states: {
    metamaskState: {context: MetamaskState};
  };
}

export const metamask: StateNodeConfig<TContext, MMStateSchema, MetamaskAction> = {
  initial: 'metamaskState',
  states: {
    metamaskState: {},
  },
};
