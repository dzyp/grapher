import React, { Component } from 'react';
import { Network, Node, Edge } from '@lifeomic/react-vis-network';

class DG extends Component {
    render() {
        console.log('nodes');
        console.log(this.props.nodes);
        return (
          <Network onClick={this.props.onClick} >
            { this.props.nodes.map(n => <Node key={n.id} id={n.id} label={n.label} color={n.color} shape={n.shape} />) }
            { this.props.edges.map(e => <Edge key={e.id} id={e.id} to={e.to} from={e.from} label={e.label} />) }
          </Network>
        );
      }
}

export default DG;
