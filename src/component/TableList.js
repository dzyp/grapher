import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

class TableList extends Component {

    handleClick(evt, id) {
        this.props.onTableSelect(id);
    }

    render() {
        return (
            <ListGroup>
                { this.props.tables.map(table => <ListGroupItem onClick={evt => this.handleClick(evt, table.id)} key={ table.id }>{ table.name }</ListGroupItem>) }
            </ListGroup>
        );
    }
}

export default TableList;
