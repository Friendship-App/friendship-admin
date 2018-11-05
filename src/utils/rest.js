import reduxApi, { transformers } from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import jwtDecode from 'jwt-decode';

import { showError } from '../modules/ErrorSnackbar';

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

if (process.env.NODE_ENV === 'development') {
  apiRoot = 'http://localhost:3000/api/admin';
} else {
  apiRoot = 'https://friendshipapp-backend.herokuapp.com/api/admin';
}

const rest = reduxApi({
  auth: {
    url: `${apiRoot}/login`,
    transformer: (data = {}) => {
      if (data.token) {
        return {
          ...data,
          decoded: jwtDecode(data.token),
        };
      }
      return data;
    },

    options: {
      method: 'POST',
    },
  },
  users: {
    url: `${apiRoot}/users`,
    transformer: transformers.array,
    crud: true,
  },
  events: {
    url: `${apiRoot}/events`,
    transformer: transformers.array,
    crud: true,
  },
  deleteEvent: {
    url: `${apiRoot}/events/delete/:eventId`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'POST'
    }
  },
  userDetails: {
    url: `${apiRoot}/users/:userId`,
    // transformer: transformers.array,
    crud: true,
  },
  deleteUser: {
    url: `${apiRoot}/users/delete/:userId`,
    crud: true,
  },
  taglist: {
    url: `${apiRoot}/tags`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET'
    }
  },
  deleteTag: {
    url: `${apiRoot}/tags/delete/:tagId`,
    crud: true,
    options: {
      method: 'POST'
    }
  },
  addTag: {
    url: `${apiRoot}/tags/add`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'POST',
    },
  },
  updateTag: {
    url: `${apiRoot}/tags/update`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'POST',
    },
  },
  tags: {
    url: `${apiRoot}/tags`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'POST',
    },
  },
  activateTag: {
    url: `${apiRoot}/tags/activate/:tagId`,
    crud: true,
    options: {
      method: 'PATCH',
    },
  },
  reports: {
    url: `${apiRoot}/report/:startIndex`,
    transformer: transformers.array,
    crud: true,
  },
  totalReports: {
    url: `${apiRoot}/getTotalReports`,
    transformer: transformers.array,
    crud: true,
  },
  reportDetails: {
    url: `${apiRoot}/reports/:reportId`,
    crud: true,
  },
  feedbacks: {
    url: `${apiRoot}/feedback/:startIndex`,
    transformer: transformers.array,
    crud: true,
  },
  totalFeedbacks: {
    url: `${apiRoot}/getTotalFeedbacks`,
    transformer: transformers.array,
    crud: true,
  },
  feedbackDetails: {
    url: `${apiRoot}/feedbacks/:feedbackId`,
    crud: true,
  },
  banUser: {
    url: `${apiRoot}/users/:userId/ban`,
    crud: true,
    options: {
      method: 'POST',
    },
  },
  unbanUser: {
    url: `${apiRoot}/users/unban/:userId`,
    crud: true,
    options: {
      method: 'DELETE',
    },
  },
  latestTos: {
    url: `${apiRoot}/tos/latest`,
    reducerName: 'tos',
    crud: true,
  },
  createTos: {
    url: `${apiRoot}/tos`,
    reducerName: 'tos',
    options: {
      method: 'POST',
    },
  },

  editUser: {
    url: `${apiRoot}/users/edit/:userId`,
    crud: true,
    options: {
      method: 'PATCH',
    },
  },

  metricsRegisteredUsers: {
    url: `${apiRoot}/metrics/registeredusers`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET',
    },
  },

  metricsActiveUsers: {
    url: `${apiRoot}/metrics/activeusers`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET',
    },
  },

  metricsActiveConversations: {
    url: `${apiRoot}/metrics/activeconversations`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET',
    },
  },

  metricsConversationsLength: {
    url: `${apiRoot}/metrics/conversationslength`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET',
    },
  },

  metricsAllMetrics: {
    url: `${apiRoot}/metrics`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET',
    },
  },

  metricsWeek: {
    url: `${apiRoot}/metrics/week`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET',
    },
  },

  metricsMonth: {
    url: `${apiRoot}/metrics/month`,
    transformer: transformers.array,
    crud: true,
    options: {
      method: 'GET',
    },
  },

  metricsmsgperconversation: {
    url: `${apiRoot}/metrics/msgperconversation`,
    crud: false,
    options: {
      method: 'GET',
    },
  },
})
  .use('options', (url, params, getState) => {
    const { auth: { data: { token } } } = getState();

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // Add token to request headers
    if (token) {
      return { headers: { ...headers, Authorization: `Bearer ${token}` } };
    }

    return { headers };
  })
  .use('fetch', adapterFetch(fetch))
  .use('responseHandler', err => {
    if (err) {
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
          details: JSON.stringify(err, Object.getOwnPropertyNames(err), 4),
        }),
      );

      throw err;
    }
  });

export default rest;
export const reducers = rest.reducers;
