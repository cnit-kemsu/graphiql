import React from 'react';
import Graphiql from 'graphiql';

const search = window.location.search;
const parameters = {};
search.substr(1).split('&').forEach(function (entry) {
  const eq = entry.indexOf('=');
  if (eq >= 0) {
    parameters[decodeURIComponent(entry.slice(0, eq))] =
      decodeURIComponent(entry.slice(eq + 1));
  }
});

if (parameters.variables) {
  try {
    parameters.variables =
      JSON.stringify(JSON.parse(parameters.variables), null, 2);
  } catch (e) {
    //
  }
}

function onEditQuery(newQuery) {
  parameters.query = newQuery;
  updateURL();
}
function onEditVariables(newVariables) {
  parameters.variables = newVariables;
  updateURL();
}
function onEditOperationName(newOperationName) {
  parameters.operationName = newOperationName;
  updateURL();
}
function updateURL() {
  const newSearch = '?' + Object.keys(parameters).filter(function (key) {
    return Boolean(parameters[key]);
  }).map(function (key) {
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(parameters[key]);
  }).join('&');
  history.replaceState(null, null, newSearch);
}

export class GraphiQL extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
  }

  fetch({ query, variables, operationName }) {
    const formdata = new FormData();
    formdata.append('query', query);
    if (variables !== undefined && variables !== null && Object.keys(variables).length > 0) formdata.append('variables', JSON.stringify(variables));
    if (operationName !== undefined && operationName !== null) formdata.append('operationName', operationName);

    return fetch(this.props.url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        //'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formdata,
      credentials: 'include',
    }).then(function (response) {
      return response.text();
    }).then(function (responseBody) {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });
  }

  render() {
    return React.createElement(Graphiql, {
      fetcher: this.fetch,
      query: parameters.query,
      variables: parameters.variables,
      operationName: parameters.operationName,
      onEditQuery: onEditQuery,
      onEditVariables: onEditVariables,
      onEditOperationName: onEditOperationName
    });
  }
}