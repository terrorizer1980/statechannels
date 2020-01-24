import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

// Not adding in currently because it breaks most of our existing components
// import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import SiteContainer from './containers/SiteContainer';
import store from './machines/store';

render(
  <Provider store={store}>
    <div style={{width: '100%'}}>
      <SiteContainer />
    </div>
  </Provider>,
  document.getElementById('root')
);
