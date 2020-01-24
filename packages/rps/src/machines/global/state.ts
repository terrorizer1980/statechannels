export interface Overlay {
  rulesVisible: boolean;
  walletVisible: boolean;
}
type TContext = any;
export type OverlayState = Overlay;
import {StateNodeConfig} from 'xstate';
import {GlobalAction} from './actions';

// xstate
interface GlobalSchema {
  states: {
    rules: VisibilitySchema;
    wallet: VisibilitySchema;
  };
}

interface VisibilitySchema {
  states: {
    visible: any;
    invisible: any;
  };
}
const rules: StateNodeConfig<TContext, VisibilitySchema, GlobalAction> = {
  initial: 'invisible',
  states: {
    visible: {on: {'APP.TOGGLE_RULES_VISIBILITY': 'invisible'}},
    invisible: {on: {'APP.TOGGLE_RULES_VISIBILITY': 'visible'}},
  },
};
const wallet: StateNodeConfig<TContext, VisibilitySchema, GlobalAction> = {
  initial: 'invisible',
  states: {
    visible: {on: {'APP.HIDE_WALLET': 'invisible'}},
    invisible: {on: {'APP.SHOW_WALLET': 'visible'}},
  },
};
export const global: StateNodeConfig<TContext, GlobalSchema, GlobalAction> = {
  type: 'parallel',
  states: {
    rules,
    wallet,
  },
};
