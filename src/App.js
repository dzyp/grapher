import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Token from './component/Token';
import Api from './service/Cerebral';
import TableList from './component/TableList';
import DG from './component/DG';
import { Button, Col, Container, Row, UncontrolledAlert } from 'reactstrap';

const tableColor = "#e04141";
const queryColor = "#7be041";
const tableShape = "triangle";
const queryShape = "square";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      tables: [],
      selectedTable: null,
      loadedIds: new Set(),
      nodes: new Map(),
      edges: []
    };
    this.api = new Api("https://h.wk-dev.wdesk.org/s/cerebral");
  }

  handleTokenChange(evt) {
    this.setState({token: evt.target.value});
  }

  handleFetchTables(evt) {
    console.log("getting tables");
    this.api.getTables(this.state.token)
      .then(tables => this.setState({tables: tables}));
  }

  handleTableSelected(id) {
    console.log(this.state);
    var selectedTable = this.state.tables.find(table => table.id === id);
    if (selectedTable == null) {
      console.log('table not found!');
      return;
    }

    var node = this.createNode(selectedTable, true);

    this.setState({
      selectedTable: selectedTable,
      nodes: new Map([[node.id, node]]),
      edges: [],
      loadedIds: new Set()
    });
  }

  createNode(item, isTable) {
    return { 
      id: item.id, 
      label: item.name, 
      color: isTable ? tableColor : queryColor, 
      shape: isTable ? tableShape : queryShape,
      query: isTable ? null : item
    };
  }

  createEdge(from, to, properties) {
    var id = from + ":" + to;
    return {
      id: id,
      from: from,
      to: to,
      label: properties['title'],
      font: {align: 'middle'}
    };
  }

  async handleNodeSelect(nodeId) {
    if (nodeId === undefined) {
      return;
    }

    if (this.hasLoaded(nodeId)) {
      // don't need to do anything
      return;
    }

    var node = this.state.nodes.get(nodeId);
    var isTable = node.color === tableColor;

    var nodes = [];
    if (isTable) {
      nodes = await this.api.getDependents(this.state.token, node.id);
    } else {
      nodes = await this.api.getDependencies(this.state.token, node.id);
    }

    nodes = nodes.map(n => this.createNode(n, !isTable));

    var edges = [];

    if (isTable) {
      nodes.forEach(query => {
        edges.push(this.createEdge(query.id, node.id, {'title': node.id + '.col1'}));
      });
    } else {
      nodes.forEach(table => edges.push(this.createEdge(node.id, table.id, {})));
    }

    console.log('edges');
    console.log(edges);
    var nodeMap = this.state.nodes;
    nodes.forEach(n => nodeMap.set(n.id, n));
    
    var totalEdges = this.state.edges;
    totalEdges.push(...edges);
    var edgeMap = new Map(totalEdges.map(e => [e.id, e]));

    this.setState({
      loadedIds: this.state.loadedIds.add(node.id),
      edges: Array.from(edgeMap.values()),
      nodes: nodeMap
    })
  }

  hasLoaded(nodeId) {
    return this.state.loadedIds.has(nodeId);
  }

  isQuery(object) {
    return object.hasOwnProperty("queryText");
  }

  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <Col xs="3">
              <Token token={this.state.token} onChange={ e => this.handleTokenChange(e) } />
              <Button type="button" onClick={evt => this.handleFetchTables(evt)}>Fetch Tables!</Button>
              <div>
                <TableList tables={this.state.tables} onTableSelect={ id => this.handleTableSelected(id) } />
              </div>
            </Col>
            <Col xs="9">
              <DG onClick={evt => this.handleNodeSelect(evt.nodes[0])} nodes={Array.from(this.state.nodes.values())} edges={this.state.edges} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
