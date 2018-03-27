import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import jwtDecode from 'jwt-decode';

import {showError} from '../modules/ErrorSnackbar';

let store;

export const injectStore = _store => {
  store = _store;
};

/*
// Endpoint configurations
These example endpoints can be called by dispatching the respective actions, e.g:

dispatch(rest.actions.teams.post({teamId: 42}, { body: JSON.stringify(exampleData) }));
Results in: POST /teams?teamId=42 with POST data from 'exampleData'

Result of request can be found in: `state.teams.data`
Information about request: `state.teams.error`, `state.teams.sync`, `state.teams.error`...
*/

let apiRoot;

if(process.env.NODE_ENV === 'development'){
  apiRoot = 'http://localhost:3888';
} else {
  apiRoot = 'https://friendshipbackend.herokuapp.com';
}

const rest = reduxApi({
  users: {
    url: `${apiRoot}/users`,
    transformer: transformers.array,
    crud: true
  },
  tags: {
    url: `${apiRoot}/tags`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'POST'
    }
  },
  newtag: {
    url: `${apiRoot}/tags`,
    transformer: transformers.array,
    crud: true
  },
  activateTag:{
    url:`${apiRoot}/tags/activate/:tagId`,
    crud: true,
    options:{
      method: 'PATCH'
    }
  },
 
  reports: {
    url: `${apiRoot}/reports`,
    transformer: transformers.array,
    crud: true
  },
  taglist: {
    url: `${apiRoot}/tags_user/taglist`,
    transformer: transformers.array,
    crud: true
  },
  tagDetails: {
    url: `${apiRoot}/tags/:tagId`,
    crud: true
  },
  userDetails: {
    url: `${apiRoot}/users/:userId`,
    crud: true
  },
  reportDetails: {
    url: `${apiRoot}/reports/:reportId`,
    crud: true
  },
  banUser: {
    url: `${apiRoot}/users/:userId/ban`,
    crud: true,
    options: {
      method: 'POST'
    }
  },
  unbanUser : {
    url: `${apiRoot}/users/unban/:userId`,
    crud: true,
    options: {
      method: 'DELETE'
    }
  },
  latestTos: {
    url: `${apiRoot}/tos/latest`,
    reducerName: "tos",
    crud: true
  },
  createTos: {
    url: `${apiRoot}/tos`,
    reducerName: "tos",
    options: {
      method: 'POST'
    }
  },
  editUser: {
    url: `${apiRoot}/users/:userId`,
    crud: true,
    options: {
      method: 'PATCH'
    }
  },

  metricsRegisteredUsers: {
    url: `${apiRoot}/metrics/registeredusers`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET'
    }
  },

  metricsActiveUsers: {
    url: `${apiRoot}/metrics/activeusers`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET'
    }
  },

  metricsActiveConversations: {
    url: `${apiRoot}/metrics/activeconversations`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET'
    }
  },

  metricsConversationsLength: {
    url: `${apiRoot}/metrics/conversationslength`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET'
    }
  },
  
  metricsAllMetrics: {
    url: `${apiRoot}/metrics`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET'
    }
  },

  metricsWeek:{
    url: `${apiRoot}/metrics/week`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET'
    }
  },

  metricsMonth:{
    url: `${apiRoot}/metrics/month`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET'
    }
  },

  metricsmsgperconversation: {
    url: `${apiRoot}/metrics/msgperconversation`,
    crud: false,
    options: {
      method: 'GET'
    }
  },

  auth: {
    url: `${apiRoot}/users/authenticate`,
    transformer: (data = {}) => {
      if(data.token){
        return {
          ...data,
          decoded: jwtDecode(data.token)
        };
      }
      return data;
    },

    options: {
      method: 'POST'
    }
  }
})
  .use('options', (url, params, getState) => {
    const {auth: {data: {token}}} = getState();

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    // Add token to request headers
    if(token){
      return {headers: {...headers, Authorization: `Bearer ${token}`}};
    }

    return {headers};
  })
  .use('fetch', adapterFetch(fetch))
  .use('responseHandler', err => {
    if(err){
      let msg = 'Error';

      // error code
      msg += err.statusCode ? ` ${err.statusCode}` : '';

      // error reason
      msg += err.error ? ` ${err.error}` : '';

      // error description
      msg += err.message ? `: ${err.message}` : '';
      store.dispatch(
        showError({
          msg,
          details: JSON.stringify(err, Object.getOwnPropertyNames(err), 4)
        })
      );

      throw err;
    }
  });

export default rest;
export const reducers = rest.reducers;
