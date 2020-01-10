import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {rps} from './xstate/xstate';
import {interpret} from 'xstate';

// Not adding in currently because it breaks most of our existing components
// import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import store from './redux/store';
import SiteContainer from './containers/SiteContainer';

// Interpret the machine, and add a listener for whenever a transition occurs.
export const service = interpret(rps).onTransition(state => {
  console.log(state.value);
});
// Start the service
service.start();

const oldDispatch = store.dispatch;
const newDispatch = (action: any) => {
  service.send(action);
  return oldDispatch(action);
};
store.dispatch = newDispatch;

render(
  <Provider store={store}>
    <div style={{width: '100%'}}>
      <SiteContainer />
    </div>
  </Provider>,
  document.getElementById('root')
);
